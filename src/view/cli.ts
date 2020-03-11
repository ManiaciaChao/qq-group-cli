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
  --size,  -s  number of items in a single page
  --type,  -t  type filter 
  --name,  -n  name filter
  --dest,  -d  download path

Examples
  $ qq-group user login
  $ qq-group group select -g 1234567890
  Current selection: 1234567890
  $ qq-group share list -n config -t json
  $ qq-group share down -i 1,3,5-12,^8-9
`,
  {
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
        alias: "s",
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
  }
);

export type Flags = typeof cli.flags;
