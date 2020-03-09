import { CookieJar,Cookie } from "tough-cookie";
import FileCookieStore from "tough-cookie-file-store"

export const store = new FileCookieStore("./cookie.json")
export const jar = new CookieJar(store);