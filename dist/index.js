"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const online_1 = require("./controller/online");
const group_1 = require("./controller/group");
const download_1 = require("./controller/download");
(async () => {
    await online_1.ensureOnline();
    // console.log(await getGroupsList());
    const groupInfo = await group_1.getGroupInfo(829709717);
    console.log(groupInfo);
    const groupShareList = await group_1.getGroupShareList(829709717);
    const file = groupShareList[0];
    console.log(file);
    await download_1.downloadFile({ id: 829709717, share: file });
})();
