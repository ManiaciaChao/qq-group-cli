import meow from "meow";

export const cli = meow(
  `
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

`,
  {
    flags: {
      all: {
        type: "boolean",
        alias: "a",
      },
      page: {
        type: "number",
        alias: "p"
      },
      group: {
        type: "number",
        alias: "g"
      },
      index: {
        type: "number",
        alias: "i"
      }
    }
  }
);

export type Flags = typeof cli.flags;
