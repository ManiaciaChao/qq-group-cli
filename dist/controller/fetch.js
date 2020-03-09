"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("qq-qr-login/dist");
const cookies_1 = require("../model/cookies");
const config_json_1 = require("../config.json");
_a = dist_1.init(config_json_1.site, cookies_1.jar), exports.login = _a.login, exports.fetch = _a.fetch;
