"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const progress_1 = __importDefault(require("../view/progress"));
const fs_1 = require("fs");
const fetch_1 = require("./fetch");
const config_json_1 = require("../config.json");
const group_1 = require("./group");
const pretty_bytes_1 = __importDefault(require("pretty-bytes"));
// import { percentage } from "../utils";
exports.downloadFile = async (config) => {
    const { id, path, share } = config;
    const filepath = path_1.join(path !== null && path !== void 0 ? path : config_json_1.downloadDir, share.filename);
    const file = fs_1.createWriteStream(filepath);
    const { body } = await fetch_1.fetch(await group_1.getGroupShareUrl(id, share));
    await new Promise((reslove, reject) => {
        // create new progress bar
        let sav = 0;
        const bar = new progress_1.default(`downloading [:bar] :percent :current/:total Rate::rate/s ETA::etas`, {
            complete: "=",
            incomplete: " ",
            head: ">",
            width: 20,
            total: share.filesize
        });
        body.on("data", chunk => {
            sav += chunk.length;
            bar.tick(chunk.length, {
                sav: pretty_bytes_1.default(sav)
            });
        });
        body.on("end", () => reslove());
        body.on("error", (err) => reject(err));
        body.pipe(file);
    });
};
