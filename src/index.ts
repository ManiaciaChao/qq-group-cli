import { ensureOnline } from "./controller/online";
import {
  getGroupsList,
  getGroupInfo,
  getGroupShareInfo,
  getGroupShareList
} from "./controller/group";
import { createWriteStream } from "fs";
import { downloadFile } from "./controller/download";
import { cli } from "./view/cli";
import actions from "./controller/commands";

actions.parse(cli.input.slice(0, 2));
// (async () => {
//   await ensureOnline();
//   const groupsList =await getGroupsList();
//   console.log(groupsList[0]);
//   const groupInfo = await getGroupInfo(groupsList[0].id)
//   console.log(groupInfo);
//   const groupShareList = await getGroupShareList(groupsList[0].id);
//   const file = groupShareList[0];
//   console.log(file);
//   await downloadFile({id:groupsList[0].id,share:file})
// })();
