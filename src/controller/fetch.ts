import { init } from "qq-qr-login";
import { jar } from "../model/cookies";
import { site } from "../config.json";

export const { login, fetch } = init(site, jar);
