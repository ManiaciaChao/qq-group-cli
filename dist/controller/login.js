"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("qq-qr-login/dist");
const cookies_1 = require("model/cookies");
const config_json_1 = __importDefault(require("src/config.json"));
_a = dist_1.init(config_json_1.default, cookies_1.jar), exports.login = _a.login, exports.fetch = _a.fetch;
const isOnline = async () => {
    const resp = await exports.fetch("http://qun.qzone.qq.com/group", {
        redirect: "manual"
    });
};
