"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("../type");
const roles = require("../../GuildData/Roles.json");
const __1 = require("../../..");
const voteList = require("../data/vote/list.json");
exports.default = new type_1.Command("vote", (message, args) => {
    switch (args[1]) {
        case "create":
            createVote(message, args[1]);
            break;
        case "close":
            closeVote(args[1]);
            break;
        default:
            __1.replyMessage(message, `\`${args[0]}\`은 알맞은 형식의 인자가 아닙니다. \`create\` 또는 \`close\`로 적어주세요!`);
            break;
    }
}, {
    aliases: ["투표"],
    description: "새로운 투표를 만들거나 기존 투표를 종료합니다.",
    enable: true,
    minArgumentCount: 2,
    showHelp: true,
    usage: `<"create"|"close"> <이름>`,
    permissions: {
        roles: [roles.admin, roles.staff]
    }
});
function createVote(message, name) {
    let vote = {
        name: name
    };
    __1.replyMessage(message, "설명을 적어주세요.");
}
function closeVote(name) {
    console.log(voteList[name]);
}
//# sourceMappingURL=vote.js.map