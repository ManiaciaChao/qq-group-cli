"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const qq_qr_login_1 = require("qq-qr-login");
const cookies_1 = require("../model/cookies");
const config_json_1 = require("../config.json");
_a = qq_qr_login_1.init(config_json_1.site, cookies_1.jar), exports.login = _a.login, exports.fetch = _a.fetch;
