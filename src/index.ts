import { ensureOnline } from "./controller/online";
import { getGroupsList, getGroupInfo, getGroupShareInfo, getGroupShareList } from "./controller/group";
import { createWriteStream } from "fs";
import { downloadFile } from "./controller/download";

(async () => {
  await ensureOnline();
  // console.log(await getGroupsList());
  const groupInfo = await getGroupInfo(829709717)
  console.log(groupInfo);
  const groupShareList = await getGroupShareList(829709717);
  const file = groupShareList[0];
  console.log(file);
  await downloadFile({id:829709717,share:file})
})();
