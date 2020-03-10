import { jar } from "../model/cookies";
import { withQuery, parseJsonp } from "../utils";
import { uin } from "../config.json";
import { getACSRFToken } from "./token";
import { fetch, login } from "./fetch";

const isOnline = async (cb?: (nick: string) => void) => {
  if (!jar.getCookieStringSync("http://qun.qzone.qq.com")) {
    return false;
  }
  const callbackFun = "_GroupMember";
  const resp = await fetch(
    withQuery("http://qun.qzone.qq.com/cgi-bin/get_group_member", {
      callbackFun,
      uin,
      groupid: "0",
      neednum: "1",
      r: Math.random(),
      g_tk: getACSRFToken()
    })
  );
  const text = await resp.text();
  const data = parseJsonp(text, callbackFun);
  console.log(data);
  if (data.code && data.code != 0) {
    return false;
  }
  cb && cb(data.nick);
  return true;
};

export const ensureOnline = async () => {
  const check = () => isOnline(nick => console.log(`${nick} already online.`));
  let online = await check();
  while (!online) {
    console.log("need login!");
    await login();
    online = await check();
  }
};
