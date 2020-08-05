"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoleFromMention = exports.getUserFromMention = exports.replyMessage = void 0;
const bot_1 = require("./bot");
const CommandManager_1 = require("./Components/CommandManager");
const teams = require("./lib/Teams/teams.json");
const roles = require("./lib/GuildData/Roles.json");
// Bot init //
// On ready
bot_1.default.client.on("ready", () => {
    // Set status
    bot_1.default.client.user.setActivity({
        type: "PLAYING",
        name: ">help로 도움말 보기"
    }).then((value) => {
        console.log(`[Bot][init] Set activity: ${value.activities[0].name}`);
    }).catch(console.error);
    // Login discord client
    console.log(`[Bot][init] Logged in: ${bot_1.default.client.user.tag}`);
});
bot_1.default.client.on("guildMemberAdd", (member) => {
    detectAddMember(member);
});
// On message
bot_1.default.client.on("message", (message) => {
    if (message.author.bot)
        return;
    CommandManager_1.default.excute(message);
});
// Login
bot_1.default.login();
// Functions //
// On member add
function detectAddMember(member) {
    // Member added
    console.log(`[Guild][user] Add: ${member.user.tag}`);
    // Get data
    let teamData;
    let userData;
    for (let i in teams) {
        userData = teams[i].members.find(value => value.tag === member.user.tag);
        if (userData) {
            teamData = teams[i];
            break;
        }
    }
    if (!userData)
        return;
    // New member is player
    console.log(`[Guild][user] ${member.user.tag} is player: ${teamData.name}: ${userData.name}_${userData.role}`);
    // Add roles
    let guildRoles = member.guild.roles.cache;
    member.roles.add(guildRoles.find(value => value.id === roles.player));
    member.roles.add(guildRoles.find(value => value.name === teamData.name));
    member.roles.add(guildRoles.find(value => value.name === teamData.type));
    member.roles.add(guildRoles.find(value => value.name === userData.role));
}
// Custom message reply
function replyMessage(message, content) {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        yield message.channel.send(`> ${message.content.replace(/\n/g, "\n> ")}\n${message.author} ${content}`).then(value => {
            result = value;
        });
        return result;
    });
}
exports.replyMessage = replyMessage;
// Get user by mention
function getUserFromMention(mention) {
    if (!mention)
        return;
    if (mention.startsWith("<@") && mention.endsWith(">")) {
        mention = mention.slice(2, -1);
        if (mention.startsWith("!")) {
            mention = mention.slice(1);
        }
        return bot_1.default.client.users.cache.get(mention);
    }
}
exports.getUserFromMention = getUserFromMention;
// Get role by mention
function getRoleFromMention(guild, mention) {
    if (!mention)
        return;
    if (mention.startsWith("<@&") && mention.endsWith(">")) {
        mention = mention.slice(3, -1);
    }
    return guild.roles.cache.get(mention);
}
exports.getRoleFromMention = getRoleFromMention;
//# sourceMappingURL=index.js.map