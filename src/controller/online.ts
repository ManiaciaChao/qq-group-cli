import { fetch, login } from "./fetch";
import { jar } from "../model/cookies";
import { open } from "./open";
import { getACSRFToken } from "./token";
import { withQuery, parseJsonp } from "../utils";

type isOnlineCallback = (nick: string) => void;

const logger: isOnlineCallback = nick => console.log(`${nick} already online.`);

const isOnline = async (cb?: isOnlineCallback) => {
  if (!jar.getCookieStringSync("http://qun.qzone.qq.com")) {
    return false;
  }
  const callbackFun = "_GroupMember";
  const resp = await fetch(
    withQuery("http://qun.qzone.qq.com/cgi-bin/get_group_member", {
      callbackFun,
      groupid: "0",
      neednum: "1",
      r: Math.random(),
      g_tk: getACSRFToken()
    })
  );
  const text = await resp.text();
  const data = parseJsonp(text, callbackFun);
  // console.log(data);
  if (data.nick) {
    cb && cb(data.nick);
    return true;
  } else {
    return false;
  }
};

export const ensureOnline = async (cb = logger) => {
  const check = () => isOnline(cb);
  let online = await check();
  while (!online) {
    console.log("Need login!");
    await login({ before: open });
    online = await check();
  }
};
