import { join } from "path";
import ProgressBar from "../view/progress";
import { createWriteStream } from "fs";

import { fetch } from "./fetch";
import { downloadDir } from "../config.json";
import { getGroupShareUrl, IGroupShare } from "./group";

import prettyBytes from "pretty-bytes";
// import { percentage } from "../utils";

export const downloadFile = async (config: {
  id: number;
  share: IGroupShare;
  path?: string;
  onProcess?: any;
}) => {
  const { id, path, share } = config;
  const filepath = join(path ?? downloadDir, share.filename);
  const file = createWriteStream(filepath);
  const { body } = await fetch(await getGroupShareUrl(id, share));
  await new Promise((reslove, reject) => {
    // create new progress bar
    let sav = 0;
    const bar = new ProgressBar(
      `downloading [:bar] :percent :current/:total Rate::rate/s ETA::etas`,
      {
        complete: "=",
        incomplete: " ",
        head: ">",
        width: 20,
        total: share.filesize
      }
    );

    body.on("data", chunk => {
      sav += chunk.length;
      bar.tick(chunk.length, {
        sav: prettyBytes(sav)
      });
    });
    body.on("end", () => reslove());
    body.on("error", (err: Error) => reject(err));
    body.pipe(file);
  });
};
