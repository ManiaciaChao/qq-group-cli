#!/usr/bin/env node

import { cli } from "./view/cli";
import actions from "./controller/commands";
import { ensureOnline } from "./controller/online";

(async () => {
  const item = actions.parse(cli.input.slice(0, 2));
  if (item) {
    const { action, ...detail } = item;
    if (!detail.withoutLogin) {
      await ensureOnline(undefined);
    }
    await action(cli.flags);
  } else {
    console.log("No such action! Please check --help.");
  }
})();
