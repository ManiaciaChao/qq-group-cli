"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
exports.sleep = (ms) => new Promise(resolve => setTimeout(() => {
    resolve();
}, ms));
exports.getCookieValue = (jar) => (url, key) => jar.getCookiesSync(url).filter(cookie => cookie.key === key)[0].value;
exports.withQuery = (url, params) => {
    const urlObj = new URL(url);
    for (const [key, val] of Object.entries(params)) {
        urlObj.searchParams.append(key, val.toString());
    }
    return url_1.format(urlObj);
};
exports.parseJsonp = (jsonp, cbName) => {
    const prefixLength = cbName.length + "_Callback".length + 1;
    const suffixLength = jsonp.length - prefixLength - 2;
    const str = jsonp.substr(prefixLength, suffixLength);
    const obj = JSON.parse(str);
    return obj.data ? obj.data : obj;
};
exports.percentage = (num) => (num * 100).toFixed(1) + "%";
exports.pager = (list, config) => {
    var _a, _b;
    if (config === null || config === void 0 ? void 0 : config.all) {
        return list;
    }
    else {
        const size = (_a = config.size) !== null && _a !== void 0 ? _a : 10;
        const page = (_b = config.page) !== null && _b !== void 0 ? _b : 1;
        let start = (page - 1) * size;
        if (start >= list.length) {
            start = list.length - size;
        }
        return list.slice(start, start + size);
    }
};
exports.time = (timestamp) => new Date(timestamp * 1000).toLocaleString();
exports.numPad = (num, pad) => num.toString().padEnd(4);
