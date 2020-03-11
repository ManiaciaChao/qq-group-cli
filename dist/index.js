"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = require("./view/cli");
const commands_1 = __importDefault(require("./controller/commands"));
const online_1 = require("./controller/online");
(async () => {
    const item = commands_1.default.parse(cli_1.cli.input.slice(0, 2));
    if (item) {
        const { action, ...detail } = item;
        if (!detail.withoutLogin) {
            await online_1.ensureOnline(undefined);
        }
        await action(cli_1.cli.flags);
    }
    else {
        console.log("No such action! Please check --help.");
    }
})();
