"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const fetch_1 = require("./fetch");
const config_json_1 = require("../config.json");
const group_1 = require("./group");
exports.downloadFile = async (config) => {
    const { id, path, share, onData } = config;
    const defaultPath = path_1.join(config_json_1.downloadDir, id.toString());
    const filepath = path_1.join(path !== null && path !== void 0 ? path : defaultPath, share.filename);
    const file = fs_1.createWriteStream(filepath);
    const { body } = await fetch_1.fetch(await group_1.getGroupShareUrl(id, share));
    await new Promise((reslove, reject) => {
        body.on("data", (chunk) => onData && onData(chunk));
        body.on("end", () => reslove());
        body.on("error", (err) => reject(err));
        body.pipe(file);
    });
};
