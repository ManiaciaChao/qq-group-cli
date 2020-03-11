"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const meow_1 = __importDefault(require("meow"));
exports.cli = meow_1.default(`
    Usage
      $ yarn start <command> <subcommand>
 
    Commands
      user login,
      user logout,
      group list, 
      group info,
      group select,
      share list,
      share info,
      share down/download

    Options
      --index, -i  specify index of group or share
      --group, -g  specify group id
      --all,   -a  list all items
      --page,  -p  list items which are in the given page
 
    Examples
      $ yarn start group select -g 1234567890
      Current selection: 1234567890

`, {
    flags: {
        all: {
            type: "boolean",
            alias: "a",
            default: false
        },
        page: {
            type: "number",
            alias: "p",
            default: 1
        },
        size: {
            type: "number",
            default: 10
        },
        group: {
            type: "number",
            alias: "g"
        },
        index: {
            type: "string",
            alias: "i"
        },
        type: {
            type: "string",
            alias: "t"
        },
        name: {
            type: "string",
            alias: "n"
        },
        dest: {
            type: "string",
            alias: "d"
        }
    }
});
