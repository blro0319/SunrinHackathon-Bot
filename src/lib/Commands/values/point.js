"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("../type");
const PointManager_1 = require("../../../Components/PointManager");
const __1 = require("../../..");
const teams = require("../../Teams/teams.json");
const roles = require("../../GuildData/Roles.json");
exports.default = new type_1.Command("point", (message, args) => {
    let point = Number(args[2]);
    if (point != 0 && !point) {
        __1.replyMessage(message, `\`${args[2]}\` 인자는 알맞은 형식이 아닙니다. 포인트는 숫자입니다!`);
        return;
    }
    // Single
    if (args[1] != ".") {
        // Check mention
        let target = __1.getUserFromMention(args[1]);
        if (target) {
            let team = "";
            for (let i in teams) {
                if (teams[i].members.find(value => value.tag === target.tag)) {
                    team = teams[i].name;
                    break;
                }
            }
            if (team == "") {
                __1.replyMessage(message, `${args[1]} 님은 팀이 없습니다!`);
                return;
            }
            args[1] = team;
        }
        else {
            let role = __1.getRoleFromMention(message.guild, args[1]);
            if (role) {
                let team = "";
                for (let i in teams) {
                    if (teams[i].name === role.name) {
                        team = teams[i].name;
                        break;
                    }
                }
                if (team == "") {
                    __1.replyMessage(message, `${args[1]} 역할은 팀이 아닙니다!`);
                    return;
                }
                args[1] = team;
            }
        }
        // Check set or add
        switch (args[0]) {
            case "set":
            case "설정":
            case "변경":
                PointManager_1.default.setPoint(args[1], point);
                __1.replyMessage(message, `\`${args[1]}\`의 HP를 \`${point}HP\`로 설정했습니다!`);
                break;
            case "add":
            case "추가":
                PointManager_1.default.addPoint(args[1], point);
                __1.replyMessage(message, `\`${args[1]}\`의 HP에 \`${point}HP\`를 더해 \`${PointManager_1.default.getPoint(args[1])}HP\` 설정했습니다!`);
                break;
            default:
                __1.replyMessage(message, `\`${args[0]}\`은 알맞은 형식의 인자가 아닙니다. \`set\` 또는 \`add\`로 적어주세요!`);
                return;
        }
    }
    // All
    else {
        // Check set or add
        switch (args[0]) {
            case "set":
                PointManager_1.default.setPointAll(point);
                __1.replyMessage(message, `모두의 HP를 \`${point}HP\`로 설정했습니다!`);
                break;
            case "add":
                PointManager_1.default.addPointAll(point);
                __1.replyMessage(message, `모두의 HP에 \`${point}HP\`를 더했습니다!`);
                break;
            default:
                __1.replyMessage(message, `\`${args[0]}\`은 알맞은 형식의 인자가 아닙니다. \`set\` 또는 \`add\`로 적어주세요!`);
                return;
        }
    }
}, {
    aliases: ["hp", "score", "포인트", "체력", "점수"],
    description: "팀의 HP를 조절합니다.",
    enable: true,
    minArgumentCount: 3,
    showHelp: true,
    usage: '<"set"|"설정"|"변경"|"add"|"추가"> <대상|멘션|"."> <HP>',
    permissions: {
        roles: [roles.admin, roles.staff]
    }
});
//# sourceMappingURL=point.js.map