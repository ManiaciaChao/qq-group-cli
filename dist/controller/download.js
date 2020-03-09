"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const cli_progress_1 = __importDefault(require("cli-progress"));
const fs_1 = require("fs");
const fetch_1 = require("./fetch");
const config_json_1 = require("../config.json");
const group_1 = require("./group");
// import prettyBytes from "pretty-bytes";
// import { percentage } from "../utils";
exports.downloadFile = async (config) => {
    const { id, path, share } = config;
    const filepath = path_1.join(path ? path : config_json_1.downloadDir, share.filename);
    const file = fs_1.createWriteStream(filepath);
    const { body } = await fetch_1.fetch(await group_1.getGroupShareUrl(id, share));
    await new Promise((reslove, reject) => {
        // create new progress bar
        const bar = new cli_progress_1.default.SingleBar({
            format: "{bar}" + "| {percentage}% || {value}/{total} Chunks || Speed: {speed}",
            barCompleteChar: "\u2588",
            barIncompleteChar: "\u2591",
            hideCursor: true
        });
        bar.start(share.filesize, 0, {
            speed: "N/A"
        });
        body.on("data", chunk => {
            bar.increment(chunk.length);
        });
        body.on("end", () => {
            bar.stop(), reslove();
        });
        body.on("error", (err) => reject(err));
        body.pipe(file);
    });
};
