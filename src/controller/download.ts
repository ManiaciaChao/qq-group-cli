import { join } from "path";
import cliProgress from "cli-progress";
import { createWriteStream } from "fs";

import { fetch } from "./fetch";
import { downloadDir } from "../config.json";
import { getGroupShareUrl, IGroupShare } from "./group";

// import prettyBytes from "pretty-bytes";
// import { percentage } from "../utils";

export const downloadFile = async (config: {
  id: number;
  share: IGroupShare;
  path?: string;
  onProcess?: any;
}) => {
  const { id, path, share } = config;
  const filepath = join(path ? path : downloadDir, share.filename);
  const file = createWriteStream(filepath);
  const { body } = await fetch(await getGroupShareUrl(id, share));
  await new Promise((reslove, reject) => {
    // create new progress bar
    const bar = new cliProgress.SingleBar({
      format:
        "{bar}" + "| {percentage}% || {value}/{total} Chunks || Speed: {speed}",
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true
    });
    bar.start(share.filesize, 0, {
      speed: "N/A"
    });
    body.on("data", chunk => {
      bar.increment(chunk.length);
    });
    body.on("end", () => {
      bar.stop(), reslove();
    });
    body.on("error", (err: Error) => reject(err));
    body.pipe(file);
  });
};
