"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = require("./view/cli");
const commands_1 = __importDefault(require("./controller/commands"));
commands_1.default.parse(cli_1.cli.input.slice(0, 2));
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
