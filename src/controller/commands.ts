import prettyBytes = require("pretty-bytes");
import { green, yellow } from "chalk";
import { ActionsRegistry } from "../model/ActionsRegistry";
import { login } from "./fetch";
import { cleanCookies } from "../model/cookies";
import { getGroupsList, getGroupInfo, getGroupShareList } from "./group";
import { cli, Flags } from "../view/cli";
import { pager, time, numPad } from "../utils";
import { select } from "../config.json";
import { set } from "../model/config";
import { downloadFile } from "./download";

const download = async (flags: Flags) => {
  const { group, index } = flags;
  const id = select ?? group;
  const list = await getGroupShareList(select ?? group);
  const share = list[index];
  if (share) {
    console.log("Start to download " + share.filename);
    await downloadFile({ id, share });
  } else {
    console.log("No such file!");
  }
};

const actions = new ActionsRegistry(cli.flags);

actions.register("user", "login", () => login());
actions.register("user", "logout", () => cleanCookies());

actions.register("group", "list", async flags => {
  const { all, page } = flags;
  const list = await getGroupsList();
  const fmt = list.map(
    ({ id, name }, index) =>
      `${yellow(index)}\t${id.toString().padEnd(10)}  ${green(name)}`
  );
  pager(fmt, { page, all }).forEach(item => console.log(item));
});
actions.register("group", "info", async flags => {
  const { group } = flags;
  const info = await getGroupInfo(select ?? group);
  const admins = info.item
    .filter(({ iscreator, ismanager }) => iscreator || ismanager)
    .map(
      ({ nick, uin, iscreator, ismanager }, index) =>
        `${numPad(index, 4)} ${iscreator ? yellow("群主") : ""}${
          ismanager ? green("管理") : ""
        } ${nick} ${uin}`
    );
    console.log(info)
  console.log(`群名: ${green(info.group_name)}`);
  console.log(`群号: ${group}`);
  console.log(`简介: ${info.finger_memo || "无"}`);
  console.log(`公告: ${info.group_memo}`);
  console.log(`人数: ${info.total}`);
  console.log(
    `创建时间: ${new Date(info.create_time * 1000).toLocaleString()}`
  );
  console.log(`管理列表:`);
  console.log(`${admins.join("\n")}`);
});
actions.register("group", "select", async flags => {
  const { group, index } = flags;
  if (group == undefined && index == undefined) {
    console.log(`Current selection: ${select}`);
    return;
  }
  const list = await getGroupsList();
  let target;
  if (group != undefined) {
    target = list.filter(({ id }) => id === group)[0];
  } else if (index != undefined) {
    target = list[index];
  }
  if (target) {
    set("select", target.id);
    console.log(`Current selection: ${target.id}`);
  } else {
    console.log("Invalid selection!");
  }
});

actions.register("share", "list", async flags => {
  const { group, all, page } = flags;
  const list = await getGroupShareList(select ?? group);
  const fmt = list.map(
    ({ filename, filesize, modifytime, uploadnick }, index) =>
      `${yellow(numPad(index, 4))} ${green(filename)}\n` +
      `${prettyBytes(filesize)}  ${time(modifytime)}  ${uploadnick}`
  );
  pager(fmt, { page, all }).forEach(item => console.log(item));
});

actions.register("share", "download", download);
actions.register("share", "down", download);

export default actions;
