import { fetch } from "./fetch";
import { getACSRFToken } from "./token";
import { withQuery, parseJsonp } from "../utils";

interface IRespGroup {
  auth: number;
  flag: number;
  groupid: number;
  groupname: string;
}

interface IGroup {
  id: number;
  name: string;
}

interface IGroupMember {
  iscreator: number;
  ismanager: number;
  nick: string;
  uin: number;
}

interface IGroupInfo {
  alpha: number; // unknown
  bbscount: number; // deprecated
  class: number; // unknown
  create_time: number; // unix timestamp
  filecount: number; // unknown, not for group share
  finger_memo: string; // description
  group_memo: string; // announcement
  group_name: string;
  item: IGroupMember[]; // creator and managers
  level: number; // vip?
  nick: string; // user's own nickname
  option: 1; // unknown
  total: number; // total number of members
}

export interface IGroupShare {
  auditflag: number; // audit
  busid: number; //n unknown
  createtime: number; // unix timestamp
  downloadtimes: number;
  filelenhight: number; // useless
  filelenlow: number; // file size, same as field "filesize"
  filename: string;
  filepath: string;
  filesize: number; // file size (unit: B)
  localname: string; // useless
  modifytime: number; // unix timestamp
  ownernick: string; // same as field "uploadnick"
  owneruin: number; // same as field "uploaduin"
  ttl: number; // unknown
  uploadlenhigh: number;
  uploadlenlow: number; // file size, same as field "filesize"
  uploadnick: string;
  uploadsize: number; // file size, same as field "filesize"
  uploaduin: number; // uploader's QQ
}

interface IGroupShareList {
  UsedHigh: number; // high stroage usage?
  UsedLow: number; // stroage usage (unit: B)
  ability: number; // unknown
  capacity: number; // maxium storage (unit: B)
  grouplevel: number;
  item: IGroupShare[];
  surplus_capacity: number; // available space (unit: B)
}

interface IGroupShareFileInfo {
  cookie: string;
  dns: string;
  ismember: number;
  md5: string;
  ret: 0;
  sha: string;
  sha3: string; // blank
  sip: string; // server ip?
  url: string;
}

export const getGroupsList = async () => {
  const resp = await fetch(
    withQuery("http://qun.qzone.qq.com/cgi-bin/get_group_list", {
      random: Math.random(),
      g_tk: getACSRFToken()
    })
  );
  const text = await resp.text();
  const { group: groups } = parseJsonp(text, "");

  return (groups as IRespGroup[]).map(({ groupid, groupname }) => ({
    id: groupid,
    name: groupname
  })) as IGroup[];
};

export const getGroupInfo = async (id: number) => {
  const callbackFun = "_GroupMember";
  const resp = await fetch(
    withQuery("http://qun.qzone.qq.com/cgi-bin/get_group_member", {
      callbackFun,
      groupid: id,
      neednum: "1",
      r: Math.random(),
      g_tk: getACSRFToken()
    })
  );
  const text = await resp.text();
  return parseJsonp(text, callbackFun) as IGroupInfo;
};

export const getGroupShareCount = async (id: number) => {
  const callbackFun = "_GroupShareInfo";
  const resp = await fetch(
    withQuery("http://qun.qzone.qq.com/cgi-bin/get_group_share_info", {
      groupid: id,
      callbackFun,
      t: Math.random(),
      g_tk: getACSRFToken()
    })
  );
  const text = await resp.text();
  const { filecount } = parseJsonp(text, callbackFun);
  return filecount as number;
};

export const getGroupShareInfo = async (id: number) => {
  const resp = await fetch(
    withQuery("http://qun.qzone.qq.com/cgi-bin/group_share_list", {
      groupid: id,
      bussinessid: "0", // unknown
      r: Math.random(),
      charset: "utf-8",
      g_tk: getACSRFToken()
    })
  );
  const text = await resp.text();
  return parseJsonp(text, "") as IGroupShareList;
};

export const getGroupShareList = async (id: number) => {
  const { item } = await getGroupShareInfo(id);
  return item;
};

export const getGroupShareFileInfo = async (
  id: number,
  { filepath }: IGroupShare
) => {
  const resp = await fetch(
    withQuery("http://qun.qzone.qq.com/cgi-bin/group_share_get_downurl", {
      groupid: id,
      pa: filepath,
      r: Math.random(),
      charset: "utf-8",
      g_tk: getACSRFToken()
    })
  );
  const text = await resp.text();
  return parseJsonp(text, "") as IGroupShareFileInfo;
};

export const getGroupShareUrl = async (id: number, share: IGroupShare) =>
  (await getGroupShareFileInfo(id, share)).url;