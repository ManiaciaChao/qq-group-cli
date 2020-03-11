"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const os_1 = require("os");
const url_1 = require("url");
const fs_1 = require("fs");
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
exports.parsePath = (path) => {
    const splited = path.split(/[\\/]/g);
    if (splited[0] === "~") {
        splited[0] = os_1.homedir();
    }
    return path_1.join(...splited);
};
exports.mkdir = (path) => {
    if (!fs_1.existsSync(path)) {
        fs_1.mkdirSync(path, { recursive: true });
    }
};
exports.percentage = (num) => (num * 100).toFixed(1) + "%";
exports.paginate = (list, config) => {
    let paginated = list;
    const size = config.size;
    const page = config.page;
    if (!(config === null || config === void 0 ? void 0 : config.all)) {
        let start = (page - 1) * size;
        if (start >= list.length) {
            start = list.length - size;
        }
        paginated = list.slice(start, start + size);
    }
    const pager = () => console.log(`total: ${paginated.length}  page: ${page}/${1 +
        Math.floor(paginated.length / size)}`);
    return { paginated, pager };
};
exports.lowerIncludes = (s, d) => s.toLowerCase().includes(d.toLocaleLowerCase());
exports.time = (timestamp) => new Date(timestamp * 1000).toLocaleString();
exports.numPad = (num, pad) => num.toString().padEnd(4);
function strToNums(str, set = false) {
    const res = new Set();
    str.split(",").forEach(part => {
        let ex = false;
        if (part.startsWith("^")) {
            ex = true;
            part = part.substr(1);
        }
        if (part.includes("-")) {
            const [start, end] = part.split("-").map(s => parseInt(s));
            for (let n = start; n <= end; n++) {
                ex ? res.delete(n) : res.add(n);
            }
        }
        else {
            const n = parseInt(part);
            ex ? res.delete(n) : res.add(n);
        }
    });
    return set ? res : [...res];
}
exports.strToNums = strToNums;
