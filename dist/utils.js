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
    return JSON.parse(str).data;
};
exports.percentage = (num) => (num * 100).toFixed(1) + "%";
