import { join, normalize } from "path";
import { createWriteStream } from "fs";
import { fetch } from "./fetch";
import { mkdir } from "../utils";
import { downloadDir } from "../config.json";
import { getGroupShareUrl, IGroupShare } from "./group";

type Chunk = string | Buffer | Uint8Array;

export const downloadFile = async (config: {
  id: number;
  share: IGroupShare;
  path?: string;
  onData?: (chunk: Chunk) => void;
}) => {
  const { id, path, share, onData } = config;
  const finalPath =
    path ?? join(normalize(__dirname + "/../../" + downloadDir), id.toString());
  mkdir(finalPath);
  const filepath = join(finalPath, share.filename);
  const file = createWriteStream(filepath);
  const { body } = await fetch(await getGroupShareUrl(id, share));
  await new Promise((reslove, reject) => {
    body.on("data", (chunk: Chunk) => onData && onData(chunk));
    body.on("end", () => reslove());
    body.on("error", (err: Error) => reject(err));
    body.pipe(file);
  });
};
