import { format } from "url";
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

export const percentage = (num: number) => (num * 100).toFixed(1) + "%";

interface IPagerConfig {
  page?: number;
  size?: number;
  all?: boolean;
}

export const pager = (list: any[],config: IPagerConfig) => {
  if (config?.all) {
    return list;
  } else {
    const size = config.size ?? 10;
    const page = config.page ?? 1;
    let start = (page - 1) * size;
    if (start >= list.length) {
      start = list.length - size;
    }
    return list.slice(start, start + size);
  }
};

export const time = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleString();

export const numPad = (num:number,pad:number)=>num.toString().padEnd(4)