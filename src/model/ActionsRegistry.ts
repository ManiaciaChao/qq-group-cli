import { Flags } from "../view/cli";

export class ActionsRegistry {
  private flags: Flags;
  private registry = new Map<string, Map<string, Function>>();
  constructor(flags: Flags) {
    this.flags = flags;
  }
  register(command: string, subcommand: string, action: Action) {
    if (!this.registry.has(command)) {
      this.registry.set(command, new Map());
    }
    const cmd = this.registry.get(command);
    if (!cmd?.has(subcommand)) {
      cmd?.set(subcommand, action);
    }
  }
  // parse(inputs: string[]) {
  //   const [command, subcommand] = inputs;
  //   const action = this.registry.get(command)?.get(subcommand);
  //   action && action(this.cli);
  // }
  parse(strings: string[]) {
    const [command, subcommand] = strings;
    const action = this.registry.get(command)?.get(subcommand);
    action && action(this.flags);
  }
}

export type Action = (cli: Flags) => any;