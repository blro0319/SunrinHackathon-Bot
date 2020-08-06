"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("../type");
const point_1 = require("./point");
const __1 = require("../../..");
const teams = require("../../Teams/teams.json");
const discord_js_1 = require("discord.js");
exports.default = new type_1.Command("team", (message, args) => {
    switch (args[0].toLowerCase()) {
        case "color":
        case "색":
            changeTeamColor(message, args[1], args[2]);
            break;
        default:
            showTeamInfo(message, args[0]);
            break;
    }
}, {
    aliases: ["팀"],
    description: "팀의 정보를 보거나 팀의 색을 변경합니다. 색은 #000000로 설정하면 초기화됩니다.",
    enable: true,
    minArgumentCount: 0,
    showHelp: true,
    usage: [
        "[이름|멘션]",
        `<"color"|"색"> <이름|멘션> <색상 코드:'#000000'>`
    ]
});
// Change taem role color
function changeTeamColor(message, target, color) {
    let team;
    if (__1.getTeamFromMention(message, target) != null) {
        team = __1.getTeamFromMention(message, target);
    }
    else if (__1.isMention(target))
        return;
    else {
        teams.forEach((value) => {
            if (target === value.name) {
                team = value;
                return;
            }
        });
        if (!team) {
            __1.replyMessage(message, `${target} 팀은 존재하지 않습니다!`);
            return;
        }
    }
    if (!/#[0-9a-fA-F]{6}/.test(color)) {
        __1.replyMessage(message, `${color} 인수는 올바른 형식의 색이 아닙니다. \`#000000\`의 형식으로 적어주세요!`);
        return;
    }
    let role = message.guild.roles.cache.find((role) => role.name === team.name);
    color = /#[0-9a-fA-F]{6}/.exec(color)[0];
    role.setColor(color);
    __1.replyMessage(message, `${role} 팀의 색을 ${color}로 변경했습니다!`);
}
// Send team info
function showTeamInfo(message, target) {
    if (!target) {
        target = message.author.toString();
    }
    let team = null;
    // Check mention
    if (__1.getTeamFromMention(message, target) != null) {
        team = __1.getTeamFromMention(message, target);
    }
    else if (__1.isMention(target))
        return;
    else {
        teams.forEach((value) => {
            if (target === value.name) {
                team = value;
                return;
            }
        });
        if (!team) {
            __1.replyMessage(message, `${target} 팀은 존재하지 않습니다!`);
            return;
        }
    }
    let role = message.guild.roles.cache.find((role) => role.name === team.name);
    let info = new discord_js_1.MessageEmbed()
        .setColor(role.color)
        .setTitle(`${team.name} 팀`)
        .setDescription(`${team.type}`);
    team.members.forEach((member, index) => {
        info.addField(member.name, member.role, index != 0);
    });
    message.channel.send(info);
    point_1.getScore(message, team.name);
}
//# sourceMappingURL=team.js.map