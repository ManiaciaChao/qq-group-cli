"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ActionsRegistry {
    constructor(flags) {
        this.registry = new Map();
        this.flags = flags;
    }
    register(command, subcommand, action, detail) {
        if (!this.registry.has(command)) {
            this.registry.set(command, new Map());
        }
        const cmd = this.registry.get(command);
        if (!(cmd === null || cmd === void 0 ? void 0 : cmd.has(subcommand))) {
            cmd === null || cmd === void 0 ? void 0 : cmd.set(subcommand, { action, ...detail });
        }
    }
    parse(strings) {
        var _a;
        const [command, subcommand] = strings;
        const item = (_a = this.registry.get(command)) === null || _a === void 0 ? void 0 : _a.get(subcommand);
        return item;
    }
}
exports.ActionsRegistry = ActionsRegistry;
