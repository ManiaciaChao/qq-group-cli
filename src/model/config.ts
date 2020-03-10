import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import config from "../config.json";

const location = join(__dirname, "../config.json");

export const set = (key: string, value: any = null) => {
  const newConfig = {
    ...config,
    [key]: value
  };
  writeFileSync(location, JSON.stringify(newConfig, null, 2));
};
