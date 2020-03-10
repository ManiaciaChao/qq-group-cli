"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ActionsRegistry {
    constructor(flags) {
        this.registry = new Map();
        this.flags = flags;
    }
    register(command, subcommand, action) {
        if (!this.registry.has(command)) {
            this.registry.set(command, new Map());
        }
        const cmd = this.registry.get(command);
        if (!(cmd === null || cmd === void 0 ? void 0 : cmd.has(subcommand))) {
            cmd === null || cmd === void 0 ? void 0 : cmd.set(subcommand, action);
        }
    }
    // parse(inputs: string[]) {
    //   const [command, subcommand] = inputs;
    //   const action = this.registry.get(command)?.get(subcommand);
    //   action && action(this.cli);
    // }
    parse(strings) {
        var _a;
        const [command, subcommand] = strings;
        const action = (_a = this.registry.get(command)) === null || _a === void 0 ? void 0 : _a.get(subcommand);
        action && action(this.flags);
    }
}
exports.ActionsRegistry = ActionsRegistry;
