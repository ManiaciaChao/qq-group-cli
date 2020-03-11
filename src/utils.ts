import { join } from "path";
import { homedir } from "os";
import { format } from "url";
import { mkdirSync, existsSync } from "fs";
import { CookieJar } from "tough-cookie";

export const sleep = (ms: number) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, ms)
  );

export interface IParams {
  [key: string]: string | number;
}

export const getCookieValue = (jar: CookieJar) => (url: string, key: string) =>
  jar.getCookiesSync(url).filter(cookie => cookie.key === key)[0].value;

export const withQuery = (url: string, params: IParams) => {
  const urlObj = new URL(url);
  for (const [key, val] of Object.entries(params)) {
    urlObj.searchParams.append(key, val.toString());
  }
  return format(urlObj);
};

export const parseJsonp = (jsonp: string, cbName: string) => {
  const prefixLength = cbName.length + "_Callback".length + 1;
  const suffixLength = jsonp.length - prefixLength - 2;
  const str = jsonp.substr(prefixLength, suffixLength);
  const obj = JSON.parse(str);
  return obj.data ? obj.data : obj;
};

export const parsePath = (path: string) => {
  const splited = path.split(/[\\/]/g);
  if (splited[0] === "~") {
    splited[0] = homedir();
  }
  return join(...splited);
};

export const mkdir = (path: string) => {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
};

export const percentage = (num: number) => (num * 100).toFixed(1) + "%";

interface IPagerConfig {
  page?: number;
  size?: number;
  all?: boolean;
}

export const paginate = (list: any[], config: IPagerConfig) => {
  let paginated = list;
  const size = config.size as number;
  const page = config.page as number;

  if (!config?.all) {
    let start = (page - 1) * size;
    if (start >= list.length) {
      start = list.length - size;
    }
    paginated = list.slice(start, start + size);
  }

  const pager = () =>
    console.log(
      `total: ${paginated.length}  page: ${page}/${1 +
        Math.floor(paginated.length / size)}`
    );
  return { paginated, pager };
};

export const lowerIncludes = (s: string, d: string) =>
  s.toLowerCase().includes(d.toLocaleLowerCase());

export const time = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleString();

export const numPad = (num: number, pad: number) => num.toString().padEnd(4);

export function strToNums<B extends boolean>(str: string): number[];
export function strToNums<B extends boolean>(
  str: string,
  set: B
): B extends true ? Set<number> : number[];
export function strToNums(str: string, set = false): Set<number> | number[] {
  const res = new Set<number>();
  str.split(",").forEach(part => {
    let ex = false;
    if (part.startsWith("^")) {
      ex = true;
      part = part.substr(1);
    }
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(s => parseInt(s));
      for (let n = start; n <= end; n++) {
        ex ? res.delete(n) : res.add(n);
      }
    } else {
      const n = parseInt(part);
      ex ? res.delete(n) : res.add(n);
    }
  });
  return set ? res : [...res];
}
