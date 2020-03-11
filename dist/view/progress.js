"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pretty_bytes_1 = __importDefault(require("pretty-bytes"));
const chalk_1 = require("chalk");
const cli_progress_1 = require("cli-progress");
class MultiBar extends cli_progress_1.MultiBar {
    constructor(opt, preset) {
        super(opt, preset);
    }
}
exports.MultiBar = MultiBar;
class SingleBar extends cli_progress_1.SingleBar {
    constructor(opt, preset) {
        super(opt, preset);
    }
}
exports.SingleBar = SingleBar;
const color = (progress) => (str) => {
    if (progress <= 0.2)
        return chalk_1.red(str);
    if (progress <= 0.6)
        return chalk_1.yellow(str);
    return chalk_1.green(str);
};
// format bar
const formatBar = (progress, options) => {
    var _a, _b, _c, _d;
    // calculate barsize
    // const {barsize,barCompleteString,barIncompleteString} = options;
    const barsize = (_a = options.barsize) !== null && _a !== void 0 ? _a : 40;
    const barCompleteString = (_b = options.barCompleteString) !== null && _b !== void 0 ? _b : "=";
    const barIncompleteString = (_c = options.barIncompleteString) !== null && _c !== void 0 ? _c : " ";
    const barGlue = (_d = options.barGlue) !== null && _d !== void 0 ? _d : ">";
    const completeSize = Math.round(progress * barsize);
    const incompleteSize = barsize - completeSize;
    // generate bar string by stripping the pre-rendered strings
    return (color(progress)(barCompleteString.substr(0, completeSize) + barGlue) +
        barIncompleteString.substr(0, incompleteSize));
};
const formatFilename = (filename) => filename.length <= 20
    ? filename
    : filename.substr(0, 7) +
        "......" +
        filename.substr(filename.length - 7, 7);
exports.customFormatter = (options, params, payload) => {
    var _a;
    const { progress, startTime } = params;
    const percentage = color(progress)((progress * 100).toFixed(1).padStart(5) + "%");
    const elapsedTime = Math.round((Date.now() - startTime) / 1000);
    const bar = formatBar(progress, options);
    const value = pretty_bytes_1.default(params.value);
    const total = chalk_1.grey(pretty_bytes_1.default(params.total));
    const filename = chalk_1.yellow(formatFilename((_a = payload.filename) !== null && _a !== void 0 ? _a : "").padEnd(20));
    return `${filename}\t[${bar}] ${percentage} [${value}/${total}]`;
};
