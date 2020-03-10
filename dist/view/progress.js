"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const progress_1 = __importDefault(require("progress"));
const pretty_bytes_1 = __importDefault(require("pretty-bytes"));
class ProgressBar extends progress_1.default {
    constructor(format, options) {
        super(format, options);
        this.stream = process.stderr;
        this.lastRender = -Infinity;
        this.renderThrottle = 0;
        this.start = Date.now();
        this.chars = {
            complete: "=",
            incomplete: "-",
            head: "="
        };
        this.lastDraw = "";
        this.fmt = format;
        this.width = options.width || this.total;
        this.chars = { ...this.chars, ...options };
    }
    render(tokens, force) {
        force = force !== undefined ? force : false;
        if (tokens)
            this.tokens = tokens;
        if (!this.stream.isTTY)
            return;
        var now = Date.now();
        var delta = now - this.lastRender;
        if (!force && delta < this.renderThrottle) {
            return;
        }
        else {
            this.lastRender = now;
        }
        var ratio = this.curr / this.total;
        ratio = Math.min(Math.max(ratio, 0), 1);
        var percent = ratio * 100;
        var incomplete, complete, completeLength;
        var elapsed = Date.now() - this.start || 1;
        var eta = percent == 100 ? 0 : elapsed * (this.total / this.curr - 1);
        var rate = this.curr / (elapsed / 1000) || 0;
        /* populate the bar template with percentages and timestamps */
        var str = this.fmt
            .replace(":current", pretty_bytes_1.default(this.curr))
            .replace(":total", pretty_bytes_1.default(this.total))
            .replace(":elapsed", isNaN(elapsed) ? "0.0" : (elapsed / 1000).toFixed(1))
            .replace(":eta", isNaN(eta) || !isFinite(eta) ? "0.0" : (eta / 1000).toFixed(1))
            .replace(":percent", `${percent.toFixed(1)}%`.padStart(6))
            .replace(":rate", pretty_bytes_1.default(rate));
        /* compute the available space (non-zero) for the bar */
        var availableSpace = Math.max(0, this.stream.columns - str.replace(":bar", "").length);
        if (availableSpace && process.platform === "win32") {
            availableSpace = availableSpace - 1;
        }
        var width = Math.min(this.width, availableSpace);
        /* TODO: the following assumes the user has one ':bar' token */
        completeLength = Math.round(width * ratio);
        complete = Array(Math.max(0, completeLength + 1)).join(this.chars.complete);
        incomplete = Array(Math.max(0, width - completeLength + 1)).join(this.chars.incomplete);
        /* add head to the complete string */
        if (completeLength > 0)
            complete = complete.slice(0, -1) + this.chars.head;
        /* fill in the actual progress bar */
        str = str.replace(":bar", complete + incomplete);
        /* replace the extra tokens */
        if (this.tokens)
            for (var key in this.tokens)
                str = str.replace(":" + key, this.tokens[key]);
        if (this.lastDraw !== str) {
            this.stream.cursorTo(0);
            this.stream.write(str);
            this.stream.clearLine(1);
            this.lastDraw = str;
        }
    }
}
exports.default = ProgressBar;
