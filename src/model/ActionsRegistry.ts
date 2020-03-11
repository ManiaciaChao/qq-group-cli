import { Flags } from "../view/cli";

export class ActionsRegistry {
  private flags: Flags;
  private registry = new Map<string, Map<string, ActionItem>>();

  constructor(flags: Flags) {
    this.flags = flags;
  }
  register(command: string, subcommand: string, action: Action, detail?: any) {
    if (!this.registry.has(command)) {
      this.registry.set(command, new Map());
    }
    const cmd = this.registry.get(command);
    if (!cmd?.has(subcommand)) {
      cmd?.set(subcommand, { action, ...detail });
    }
  }

  parse(strings: string[]) {
    const [command, subcommand] = strings;
    const item = this.registry.get(command)?.get(subcommand);
    return item;
  }
}

interface ActionItem {
  action: Action;
  [key: string]: any;
}
export type Action = (cli: Flags) => void;
