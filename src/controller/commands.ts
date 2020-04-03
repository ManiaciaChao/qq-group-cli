import { extname } from "path";
import prettyBytes from "pretty-bytes";
import { green, yellow, grey } from "chalk";
import { open } from "./open";
import { set } from "../model/config";
import { select } from "../config.json";
import { cli, Flags } from "../view/cli";
import { downloadFile } from "./download";
import { cleanCookies } from "../model/cookies";
import {
  paginate,
  time,
  numPad,
  strToNums,
  lowerIncludes,
  parsePath
} from "../utils";
import { ActionsRegistry } from "../model/ActionsRegistry";
import { customFormatter, MultiBar } from "../view/progress";
import {
  getGroupsList,
  getGroupInfo,
  getGroupShareList,
  IGroupShare
} from "./group";
import { login } from "./fetch";

const actions = new ActionsRegistry(cli.flags);

actions.register("user", "login", () => login({ before: open }), {
  withoutLogin: true
});
actions.register(
  "user",
  "logout",
  () => {
    cleanCookies();
    console.log("Logged out.");
  },
  { withoutLogin: true }
);

actions.register("group", "list", async flags => {
  const { all, page, index, name, size } = flags;
  const list = await getGroupsList();
  const fmt = list
    .map((group, i) => ({ ...group, i }))
    .filter(
      ({ name: groupName }, i) =>
        (index ? strToNums(index, true).has(i) : true) &&
        (name ? lowerIncludes(groupName, name) : true)
    )
    .map(
      ({ id, name, i }) =>
        `${yellow(i.toString().padEnd(4))} ${id.toString().padEnd(10)}  ${green(
          name
        )}`
    );
  const { paginated, pager } = paginate(fmt, flags);
  paginated.forEach(item => console.log(item));
  pager();
});
actions.register("group", "info", async flags => {
  const { group } = flags;
  const id = select ?? group;
  if (!id) {
    console.log("Invalid selection!");
  }
  const info = await getGroupInfo(id);
  const admins = info.item
    .filter(({ iscreator, ismanager }) => iscreator || ismanager)
    .map(
      ({ nick, uin, iscreator, ismanager }, index) =>
        `${numPad(index, 4)} ${iscreator ? yellow("群主") : ""}${
          ismanager ? green("管理") : ""
        } ${nick} ${uin}`
    );
  console.log(`群名: ${green(info.group_name)}`);
  console.log(`群号: ${id}`);
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
  const { group, index, name } = flags;
  if (group == undefined && index == undefined) {
    console.log(`Current selection: ${select}`);
    return;
  }
  const list = await getGroupsList();
  const target = list.filter(
    ({ id, name: groupName }, i) =>
      (index ? strToNums(index, true).has(i) : true) &&
      (group ? group === id : true) &&
      (name ? lowerIncludes(groupName, name) : true)
  )[0];
  if (target) {
    set("select", target.id);
    console.log(`Current selection: ${target.id}`);
  } else {
    console.log("Invalid selection!");
  }
});

actions.register("share", "list", async flags => {
  const { group, index, name, type } = flags;
  let list = await getGroupShareList(select ?? group);
  if (!group) {
    console.log("Invalid selection!");
  }
  const fmt = list
    .map((share, i) => ({ ...share, i }))
    .filter(
      ({ filename, i }) =>
        (index ? strToNums(index, true).has(i) : true) &&
        (name ? lowerIncludes(filename, name) : true) &&
        (type ? lowerIncludes(extname(filename), type) : true)
    )
    .map(
      ({ filename, filesize, modifytime, uploadnick, i }) =>
        `${yellow(numPad(i, 4))} ${green(filename)}\n` +
        grey(`${prettyBytes(filesize)}  ${time(modifytime)}  ${uploadnick}`)
    );
  const { paginated, pager } = paginate(fmt, flags);
  paginated.forEach(item => console.log(item));
  pager();
});

actions.register("share", "download", download);
actions.register("share", "down", download);

async function download(flags: Flags) {
  const { group, all, dest } = flags;
  const path = dest ? parsePath(dest) : undefined;
  const id = select ?? group;
  if (!id) {
    console.log("Invalid selection!");
  }
  const list = await getGroupShareList(id);
  const multibar = new MultiBar({
    hideCursor: true,
    format: customFormatter
  });
  const jobs = [] as Promise<void>[];
  const addJob = (share: IGroupShare) => {
    const { filename, filesize } = share;
    const bar = multibar.create(filesize, 0, { filename });
    jobs.push(
      new Promise(async (resolve, reject) => {
        await downloadFile({
          id,
          share,
          path,
          onData: chunk => {
            bar.increment(chunk.length);
          }
        });
        resolve();
      })
    );
  };
  if (all) {
    for (const share of list) {
      addJob(share);
    }
  } else {
    const { index, name, type } = flags;
    const filtered = list.filter(
      ({ filename }, i) =>
        (index ? strToNums(index, true).has(i) : true) &&
        (name ? lowerIncludes(filename, name) : true) &&
        (type ? lowerIncludes(extname(filename), type) : true)
    );
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

export default actions;
