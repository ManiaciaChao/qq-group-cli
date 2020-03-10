"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const config_json_1 = require("../config.json");
const token_1 = require("./token");
const fetch_1 = require("./fetch");
exports.getGroupsList = async () => {
    const resp = await fetch_1.fetch(utils_1.withQuery("http://qun.qzone.qq.com/cgi-bin/get_group_list", {
        uin: config_json_1.uin,
        random: Math.random(),
        g_tk: token_1.getACSRFToken()
    }));
    const text = await resp.text();
    const { group: groups } = utils_1.parseJsonp(text, "");
    return groups.map(({ groupid, groupname }) => ({
        id: groupid,
        name: groupname
    }));
};
exports.getGroupInfo = async (id) => {
    const callbackFun = "_GroupMember";
    const resp = await fetch_1.fetch(utils_1.withQuery("http://qun.qzone.qq.com/cgi-bin/get_group_member", {
        callbackFun,
        uin: config_json_1.uin,
        groupid: id,
        neednum: "1",
        r: Math.random(),
        g_tk: token_1.getACSRFToken()
    }));
    const text = await resp.text();
    return utils_1.parseJsonp(text, callbackFun);
};
exports.getGroupShareCount = async (id) => {
    const callbackFun = "_GroupShareInfo";
    const resp = await fetch_1.fetch(utils_1.withQuery("http://qun.qzone.qq.com/cgi-bin/get_group_share_info", {
        groupid: id,
        uin: config_json_1.uin,
        callbackFun,
        t: Math.random(),
        g_tk: token_1.getACSRFToken()
    }));
    const text = await resp.text();
    const { filecount } = utils_1.parseJsonp(text, callbackFun);
    return filecount;
};
exports.getGroupShareInfo = async (id) => {
    const resp = await fetch_1.fetch(utils_1.withQuery("http://qun.qzone.qq.com/cgi-bin/group_share_list", {
        uin: config_json_1.uin,
        groupid: id,
        bussinessid: "0",
        r: Math.random(),
        charset: "utf-8",
        g_tk: token_1.getACSRFToken()
    }));
    const text = await resp.text();
    return utils_1.parseJsonp(text, "");
};
exports.getGroupShareList = async (id) => {
    const { item } = await exports.getGroupShareInfo(id);
    return item;
};
exports.getGroupShareFileInfo = async (id, { filepath }) => {
    const resp = await fetch_1.fetch(utils_1.withQuery("http://qun.qzone.qq.com/cgi-bin/group_share_get_downurl", {
        uin: config_json_1.uin,
        groupid: id,
        pa: filepath,
        r: Math.random(),
        charset: "utf-8",
        g_tk: token_1.getACSRFToken()
    }));
    const text = await resp.text();
    return utils_1.parseJsonp(text, "");
};
exports.getGroupShareUrl = async (id, share) => (await exports.getGroupShareFileInfo(id, share)).url;