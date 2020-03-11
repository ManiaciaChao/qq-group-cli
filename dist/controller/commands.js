"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const pretty_bytes_1 = __importDefault(require("pretty-bytes"));
const chalk_1 = require("chalk");
const config_1 = require("../model/config");
const config_json_1 = require("../config.json");
const cli_1 = require("../view/cli");
const download_1 = require("./download");
const cookies_1 = require("../model/cookies");
const utils_1 = require("../utils");
const ActionsRegistry_1 = require("../model/ActionsRegistry");
const progress_1 = require("../view/progress");
const group_1 = require("./group");
const fetch_1 = require("./fetch");
const actions = new ActionsRegistry_1.ActionsRegistry(cli_1.cli.flags);
actions.register("user", "login", () => fetch_1.login(), { withoutLogin: true });
actions.register("user", "logout", () => {
    cookies_1.cleanCookies();
    console.log("Logged out.");
}, { withoutLogin: true });
actions.register("group", "list", async (flags) => {
    const { all, page, index, name, size } = flags;
    const list = await group_1.getGroupsList();
    const fmt = list
        .map((group, i) => ({ ...group, i }))
        .filter(({ name: groupName }, i) => (index ? utils_1.strToNums(index, true).has(i) : true) &&
        (name ? utils_1.lowerIncludes(groupName, name) : true))
        .map(({ id, name, i }) => `${chalk_1.yellow(i.toString().padEnd(4))} ${id.toString().padEnd(10)}  ${chalk_1.green(name)}`);
    const { paginated, pager } = utils_1.paginate(fmt, flags);
    paginated.forEach(item => console.log(item));
    pager();
});
actions.register("group", "info", async (flags) => {
    const { group } = flags;
    const id = config_json_1.select !== null && config_json_1.select !== void 0 ? config_json_1.select : group;
    if (!id) {
        console.log("Invalid selection!");
    }
    const info = await group_1.getGroupInfo(id);
    const admins = info.item
        .filter(({ iscreator, ismanager }) => iscreator || ismanager)
        .map(({ nick, uin, iscreator, ismanager }, index) => `${utils_1.numPad(index, 4)} ${iscreator ? chalk_1.yellow("群主") : ""}${ismanager ? chalk_1.green("管理") : ""} ${nick} ${uin}`);
    console.log(`群名: ${chalk_1.green(info.group_name)}`);
    console.log(`群号: ${id}`);
    console.log(`简介: ${info.finger_memo || "无"}`);
    console.log(`公告: ${info.group_memo}`);
    console.log(`人数: ${info.total}`);
    console.log(`创建时间: ${new Date(info.create_time * 1000).toLocaleString()}`);
    console.log(`管理列表:`);
    console.log(`${admins.join("\n")}`);
});
actions.register("group", "select", async (flags) => {
    const { group, index, name } = flags;
    if (group == undefined && index == undefined) {
        console.log(`Current selection: ${config_json_1.select}`);
        return;
    }
    const list = await group_1.getGroupsList();
    const target = list.filter(({ id, name: groupName }, i) => (index ? utils_1.strToNums(index, true).has(i) : true) &&
        (group ? group === id : true) &&
        (name ? utils_1.lowerIncludes(groupName, name) : true))[0];
    if (target) {
        config_1.set("select", target.id);
        console.log(`Current selection: ${target.id}`);
    }
    else {
        console.log("Invalid selection!");
    }
});
actions.register("share", "list", async (flags) => {
    const { group, index, name, type } = flags;
    let list = await group_1.getGroupShareList(config_json_1.select !== null && config_json_1.select !== void 0 ? config_json_1.select : group);
    if (!group) {
        console.log("Invalid selection!");
    }
    const fmt = list
        .map((share, i) => ({ ...share, i }))
        .filter(({ filename, i }) => (index ? utils_1.strToNums(index, true).has(i) : true) &&
        (name ? utils_1.lowerIncludes(filename, name) : true) &&
        (type ? utils_1.lowerIncludes(path_1.extname(filename), type) : true))
        .map(({ filename, filesize, modifytime, uploadnick, i }) => `${chalk_1.yellow(utils_1.numPad(i, 4))} ${chalk_1.green(filename)}\n` +
        chalk_1.grey(`${pretty_bytes_1.default(filesize)}  ${utils_1.time(modifytime)}  ${uploadnick}`));
    const { paginated, pager } = utils_1.paginate(fmt, flags);
    paginated.forEach(item => console.log(item));
    pager();
});
actions.register("share", "download", download);
actions.register("share", "down", download);
async function download(flags) {
    const { group, all, dest } = flags;
    const path = dest ? utils_1.parsePath(dest) : undefined;
    const id = config_json_1.select !== null && config_json_1.select !== void 0 ? config_json_1.select : group;
    if (!id) {
        console.log("Invalid selection!");
    }
    const list = await group_1.getGroupShareList(id);
    const multibar = new progress_1.MultiBar({
        hideCursor: true,
        format: progress_1.customFormatter
    });
    const jobs = [];
    const addJob = (share) => {
        const { filename, filesize } = share;
        const bar = multibar.create(filesize, 0, { filename });
        jobs.push(new Promise(async (resolve, reject) => {
            await download_1.downloadFile({
                id,
                share,
                path,
                onData: chunk => {
                    bar.increment(chunk.length);
                }
            });
            resolve();
        }));
    };
    if (all) {
        for (const share of list) {
            addJob(share);
        }
    }
    else {
        const { index, name, type } = flags;
        const filtered = list.filter(({ filename }, i) => (index ? utils_1.strToNums(index, true).has(i) : true) &&
            (name ? utils_1.lowerIncludes(filename, name) : true) &&
            (type ? utils_1.lowerIncludes(path_1.extname(filename), type) : true));
        if (!filtered.length) {
            console.log("No such file!");
            return;
        }
        for (const share of filtered) {
            addJob(share);
        }
    }
    await Promise.all(jobs);
    multibar.stop();
}
exports.default = actions;
