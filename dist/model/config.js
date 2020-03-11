"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const config_json_1 = __importDefault(require("../config.json"));
const location = path_1.join(__dirname, "../config.json");
console.log(location);
exports.set = (key, value = null) => {
    const newConfig = {
        ...config_json_1.default,
        [key]: value
    };
    fs_1.writeFileSync(location, JSON.stringify(newConfig, null, 2));
};
