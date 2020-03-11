"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tough_cookie_1 = require("tough-cookie");
const tough_cookie_file_store_1 = __importDefault(require("tough-cookie-file-store"));
exports.store = new tough_cookie_file_store_1.default("./cookie.json");
exports.jar = new tough_cookie_1.CookieJar(exports.store);
exports.cleanCookies = () => {
    const tasks = [];
    for (const [domain, paths] of Object.entries(exports.store.idx)) {
        for (const path of Object.keys(paths)) {
            exports.store.removeCookies(domain, path, err => { });
        }
    }
};
