"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScore = void 0;
const type_1 = require("../type");
const discord_js_1 = require("discord.js");
const PointManager_1 = require("../../../Components/PointManager");
const __1 = require("../../..");
const roles = require("../../GuildData/Roles.json");
exports.default = new type_1.Command("point", (message, args) => {
    switch (args[0].toLowerCase()) {
        case "set":
        case "설정":
        case "변경":
            setScore(message, args[1], args[2]);
            break;
        case "add":
        case "추가":
            addScore(message, args[1], args[2]);
            break;
        case "get":
        case "보기":
            getScore(message, args[1]);
            break;
        default:
            __1.replyMessage(message, `\`${args[0]}\`은 알맞은 형식의 인자가 아닙니다. \`set\` 또는 \`add\` 또는 \`get\`로 적어주세요!`);
            return;
    }
}, {
    aliases: ["hp", "score", "포인트", "체력", "점수"],
    description: "팀의 HP를 조절거나 봅니다. 스태프 이상만 사용할 수 있습니다.",
    enable: true,
    minArgumentCount: 2,
    showHelp: true,
    usage: [
        '<"set"|"설정"|"변경"> <이름|멘션> <HP>',
        '<"add"|"추가"> <이름|멘션> <HP>',
        '<"get"|"보기"> <이름|멘션>'
    ],
    permissions: {
        roles: [roles.admin, roles.staff]
    }
});
function setScore(message, target, point) {
    if (Number.isNaN(Number(point))) {
        __1.replyMessage(message, `\`${point}\` 인자는 알맞은 형식이 아닙니다. HP는 숫자입니다!`);
        return;
    }
    // All
    if (target === ".") {
        PointManager_1.default.setPointAll(Number(point));
        __1.replyMessage(message, `모두의 HP를 \`${__1.numberFormat(Number(point))}HP\`로 설정했습니다!`);
    }
    // Single
    else {
        // Check mention
        if (__1.getTeamFromMention(message, target) != null) {
            target = __1.getTeamFromMention(message, target).name;
        }
        if (__1.isMention(target))
            return;
        PointManager_1.default.setPoint(target, Number(point));
        __1.replyMessage(message, `\`${target}\`의 HP를 \`${__1.numberFormat(Number(point))}HP\`로 설정했습니다!`);
        getScore(message, target);
    }
}
function addScore(message, target, point) {
    if (Number.isNaN(Number(point))) {
        __1.replyMessage(message, `\`${point}\` 인자는 알맞은 형식이 아닙니다. HP는 숫자입니다!`);
        return;
    }
    // All
    if (target === ".") {
        PointManager_1.default.addPointAll(Number(point));
        __1.replyMessage(message, `모두의 HP에 \`${__1.numberFormat(Number(point))}HP\`를 더했습니다!`);
    }
    // Single
    else {
        // Check mention
        if (__1.getTeamFromMention(message, target) != null) {
            target = __1.getTeamFromMention(message, target).name;
        }
        if (__1.isMention(target))
            return;
        PointManager_1.default.addPoint(target, Number(point));
        __1.replyMessage(message, `\`${target}\`의 HP에 \`${__1.numberFormat(Number(point))}HP\`를 더해 \`${__1.numberFormat(PointManager_1.default.getPoint(target))}HP\`로 설정했습니다!`);
        getScore(message, target);
    }
}
function getScore(message, target) {
    // Check mention
    if (__1.getTeamFromMention(message, target) != null) {
        target = __1.getTeamFromMention(message, target).name;
    }
    if (__1.isMention(target))
        return;
    // Send result
    let point = PointManager_1.default.getPoint(target);
    message.channel.send(new discord_js_1.MessageEmbed()
        .setColor("#e61f71")
        .setTitle(`${target}의 HP`)
        .addField(PointManager_1.default.pointToIcon(point), `${__1.numberFormat(point)}HP`));
}
exports.getScore = getScore;
//# sourceMappingURL=point.js.map