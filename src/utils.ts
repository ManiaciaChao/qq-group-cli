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
  return JSON.parse(str).data;
};

export const percentage = (num: number) => (num * 100).toFixed(1) + "%";
