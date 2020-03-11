import { jar } from "../model/cookies";
import { getCookieValue } from "../utils";

export const getACSRFToken = function() {
  var _DJB = function(e: string) {
    var t = 5381;
    for (var n = 0, i = e.length; n < i; ++n) {
      t += (t << 5) + e.charAt(n).charCodeAt(0);
    }
    return t & 2147483647;
  };
  var e = getCookieValue(jar)("http://qun.qzone.qq.com", "skey");
  return _DJB(e);
};