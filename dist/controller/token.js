"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cookies_1 = require("../model/cookies");
const utils_1 = require("../utils");
exports.getACSRFToken = function () {
    var _DJB = function (e) {
        var t = 5381;
        for (var n = 0, i = e.length; n < i; ++n) {
            t += (t << 5) + e.charAt(n).charCodeAt(0);
        }
        return t & 2147483647;
    };
    var e = utils_1.getCookieValue(cookies_1.jar)("http://qun.qzone.qq.com", "skey");
    return _DJB(e);
};
