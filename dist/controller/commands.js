"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prettyBytes = require("pretty-bytes");
const chalk_1 = require("chalk");
const ActionsRegistry_1 = require("../model/ActionsRegistry");
const fetch_1 = require("./fetch");
const cookies_1 = require("../model/cookies");
const group_1 = require("./group");
const cli_1 = require("../view/cli");
const utils_1 = require("../utils");
const config_json_1 = require("../config.json");
const config_1 = require("../model/config");
const download_1 = require("./download");
const download = async (flags) => {
    const { group, index } = flags;
    const id = config_json_1.select !== null && config_json_1.select !== void 0 ? config_json_1.select : group;
    const list = await group_1.getGroupShareList(config_json_1.select !== null && config_json_1.select !== void 0 ? config_json_1.select : group);
    const share = list[index];
    if (share) {
        console.log("Start to download " + share.filename);
        await download_1.downloadFile({ id, share });
    }
    else {
        console.log("No such file!");
    }
};
const actions = new ActionsRegistry_1.ActionsRegistry(cli_1.cli.flags);
actions.register("user", "login", () => fetch_1.login());
actions.register("user", "logout", () => cookies_1.cleanCookies());
actions.register("group", "list", async (flags) => {
    const { all, page } = flags;
    const list = await group_1.getGroupsList();
    const fmt = list.map(({ id, name }, index) => `${chalk_1.yellow(index)}\t${id.toString().padEnd(10)}  ${chalk_1.green(name)}`);
    utils_1.pager(fmt, { page, all }).forEach(item => console.log(item));
});
actions.register("group", "info", async (flags) => {
    const { group } = flags;
    const info = await group_1.getGroupInfo(config_json_1.select !== null && config_json_1.select !== void 0 ? config_json_1.select : group);
    const admins = info.item
        .filter(({ iscreator, ismanager }) => iscreator || ismanager)
        .map(({ nick, uin, iscreator, ismanager }, index) => `${utils_1.numPad(index, 4)} ${iscreator ? chalk_1.yellow("群主") : ""}${ismanager ? chalk_1.green("管理") : ""} ${nick} ${uin}`);
    console.log(info);
    console.log(`群名: ${chalk_1.green(info.group_name)}`);
    console.log(`群号: ${group}`);
    console.log(`简介: ${info.finger_memo || "无"}`);
    console.log(`公告: ${info.group_memo}`);
    console.log(`人数: ${info.total}`);
    console.log(`创建时间: ${new Date(info.create_time * 1000).toLocaleString()}`);
    console.log(`管理列表:`);
    console.log(`${admins.join("\n")}`);
});
actions.register("group", "select", async (flags) => {
    const { group, index } = flags;
    if (group == undefined && index == undefined) {
        console.log(`Current selection: ${config_json_1.select}`);
        return;
    }
    const list = await group_1.getGroupsList();
    let target;
    if (group != undefined) {
        target = list.filter(({ id }) => id === group)[0];
    }
    else if (index != undefined) {
        target = list[index];
    }
    if (target) {
        config_1.set("select", target.id);
        console.log(`Current selection: ${target.id}`);
    }
    else {
        console.log("Invalid selection!");
    }
});
actions.register("share", "list", async (flags) => {
    const { group, all, page } = flags;
    const list = await group_1.getGroupShareList(config_json_1.select !== null && config_json_1.select !== void 0 ? config_json_1.select : group);
    const fmt = list.map(({ filename, filesize, modifytime, uploadnick }, index) => `${chalk_1.yellow(utils_1.numPad(index, 4))} ${chalk_1.green(filename)}\n` +
        `${prettyBytes(filesize)}  ${utils_1.time(modifytime)}  ${uploadnick}`);
    utils_1.pager(fmt, { page, all }).forEach(item => console.log(item));
});
actions.register("share", "download", download);
actions.register("share", "down", download);
exports.default = actions;
