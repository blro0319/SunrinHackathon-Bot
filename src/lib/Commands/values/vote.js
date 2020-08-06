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
const type_1 = require("../type");
const discord_js_1 = require("discord.js");
const __1 = require("../../..");
exports.default = new type_1.Command("vote", (message, args) => {
    switch (args[0]) {
        case "create":
        case "생성":
        case "만들기":
            createVote(message, args.slice(1).join(" "));
            break;
        default:
            __1.replyMessage(message, `\`${args[0]}\`은 알맞은 형식의 인자가 아닙니다. \`create\` 또는 \`close\`로 적어주세요!`);
            break;
    }
}, {
    aliases: ["투표"],
    description: "새로운 투표를 만들어 진행합니다.",
    enable: true,
    minArgumentCount: 2,
    showHelp: true,
    usage: `<"create"|"생성"|"만들기"> <이름>`,
    permissions: {
        roles: []
    }
});
function createVote(message, name) {
    return __awaiter(this, void 0, void 0, function* () {
        let vote = {
            author: message.author,
            name: name
        };
        // Vote init format
        let votePrefix = ">>";
        let voteFilter = (msg) => {
            return msg.author === message.author && msg.content.startsWith(votePrefix);
        };
        let voteOptions = { max: 1, time: 300000 };
        let voteCatch = (error) => {
            __1.replyMessage(message, `${vote.name} 투표 설정을 시작한지 ${voteOptions.time / 60000}분이 지나 투표 만들기가 취소되었습니다!\n` +
                `시스템 문제라고 생각된다면 관리자를 호출해주세요!`);
            console.log(error);
        };
        // Vote progress message
        let voteProgress = `**투표 만들기**\n* 입력하지 않고 ${voteOptions.time / 60000}분이 지나면 취소됩니다.\n> 이름: ${vote.name}\n`;
        // Get description
        let progress;
        message.channel.send(voteProgress +
            `> 설명: \`${votePrefix}<설명>\`의 형식으로 설명을 입력해주세요!\n` +
            `${message.author}`).then((msg) => {
            // Delete before
            progress = msg;
        });
        // Get description
        message.channel.awaitMessages(voteFilter, voteOptions).then((value) => {
            vote.description = value.first().content.slice(votePrefix.length);
            voteProgress += `> 설명: ${vote.description}\n`;
            // Delete before
            value.first().delete();
            progress.delete();
            // Get time limit
            message.channel.send(voteProgress +
                `> 제한시간: \`${votePrefix}<제한시간:초>\`의 형식으로 제한시간을 입력해주세요!\n` +
                `${message.author}`).then((msg) => {
                progress = msg;
            });
            message.channel.awaitMessages((msg) => {
                if (!voteFilter(msg))
                    return false;
                // Check is number
                let num = Number(msg.content.replace(/\s/g, "").slice(votePrefix.length));
                if (Number.isNaN(num)) {
                    __1.replyMessage(msg, `\`${msg.content}\` 인자는 알맞은 형식이 아닙니다. 제한시간은 숫자입니다!`);
                    return false;
                }
                return true;
            }, voteOptions).then((value) => {
                vote.time = Number(value.first().content.replace(/\s/g, "").slice(votePrefix.length));
                voteProgress += `> 제한시간: ${vote.time}초\n`;
                // Delete before
                value.first().delete();
                progress.delete();
                // Get items
                message.channel.send(voteProgress +
                    `> 항목: \`${votePrefix}<이모지>:<이름>\`의 형식으로 항목을 입력해주세요. 여러 줄로 입력하면 다양한 항목들이 추가됩니다!\n` +
                    `${message.author}`).then((msg) => {
                    progress = msg;
                });
                message.channel.awaitMessages((msg) => {
                    if (!voteFilter(msg))
                        return false;
                    // Split items
                    let valiable = true;
                    let usedEmojis = [];
                    msg.content.split("\n").forEach(value => {
                        if (!value.startsWith(votePrefix)) {
                            valiable = false;
                            return;
                        }
                        let emoji = value.split(":")[0].replace(/\s/g, "").slice(votePrefix.length);
                        // Check is emoji
                        let emojiTest = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;
                        if (!emojiTest.test(emoji)) {
                            __1.replyMessage(msg, `\`${emoji}\` 문구는 이모지가 아닙니다!`);
                            valiable = false;
                            return;
                        }
                        emoji = emojiTest.exec(emoji)[0];
                        // Check overlap
                        if (usedEmojis.includes(emoji)) {
                            __1.replyMessage(msg, `\`${emoji}\` 이모지는 이미 사용된 이모지입니다!`);
                            valiable = false;
                            return;
                        }
                        usedEmojis.push(emoji);
                    });
                    return valiable;
                }, voteOptions).then((value) => {
                    vote.items = [];
                    let items = value.first().content.split("\n");
                    items.forEach((content) => {
                        let emoji = content.split(":")[0].replace(/\s/g, "").slice(votePrefix.length);
                        let title = content.split(":").slice(1).join(":");
                        if (title === "")
                            title = emoji;
                        vote.items.push({
                            emoji: emoji,
                            title: content.split(":").slice(1).join(":")
                        });
                    });
                    // Delete before
                    value.first().delete();
                    progress.delete();
                    // Show vote message
                    message.channel.send(createVoteMessage(vote)).then((msg) => {
                        let reacts = [];
                        vote.items.forEach((item) => {
                            msg.react(item.emoji);
                            reacts.push(item.emoji);
                        });
                        // Await votes
                        msg.awaitReactions((reaction, user) => {
                            let valiable = true;
                            if (user.bot)
                                return true;
                            msg.reactions.cache.forEach((value) => {
                                // Skip self
                                if (value.emoji.name === reaction.emoji.name)
                                    return;
                                // Check multiple reactions
                                if (value.users.cache.find((u) => u.id === user.id)) {
                                    message.channel.send(`여러 항목을 투표할 수 없습니다!\n${user}`);
                                    reaction.users.remove(user.id);
                                    valiable = false;
                                    return;
                                }
                            });
                            return valiable && reacts.includes(reaction.emoji.name);
                        }, {
                            time: vote.time * 1000
                        }).then((value) => {
                            // Vote result
                            let result = {
                                vote: vote,
                                reactions: new Map()
                            };
                            // Add reaction data
                            value.forEach((reaction, key) => {
                                result.reactions.set(key, {
                                    title: vote.items.find((value) => value.emoji === key).title,
                                    count: reaction.count - 1,
                                    users: []
                                });
                                reaction.users.cache.array().forEach((user) => {
                                    if (!user.bot)
                                        result.reactions.get(key).users.push(user);
                                });
                            });
                            // Delete before
                            msg.delete();
                            // Send result
                            message.channel.send(createVoteResult(result));
                        });
                    });
                }).catch(voteCatch);
            }).catch(voteCatch);
        }).catch(voteCatch);
    });
}
function createVoteMessage(vote) {
    let embed = new discord_js_1.MessageEmbed()
        .setColor("#e61f71")
        .setAuthor(`${vote.author.tag} 님의 투표`, vote.author.avatarURL())
        .setTitle(vote.name)
        .setDescription(vote.description)
        .addField("\u200b", "\u200b", false)
        .setTimestamp(new Date())
        .setFooter(`${new Date(Date.now() + vote.time * 1000).toLocaleString().replace(/├F10: (.{2})┤/, "$1")} 에 종료`);
    vote.items.forEach((item) => {
        embed.addField(`${item.emoji} ${item.title}`, "\u200b", false);
    });
    return embed;
}
function createVoteResult(result) {
    let embed = new discord_js_1.MessageEmbed()
        .setColor("#e61f71")
        .setAuthor(`${result.vote.author.tag} 님의 투표 결과`, result.vote.author.avatarURL())
        .setTitle(`${result.vote.name}`)
        .setDescription(result.vote.description)
        .addField("\u200b", "\u200b", false)
        .setTimestamp(new Date());
    result.reactions.forEach((reaction, key) => {
        let users = ``;
        reaction.users.forEach((user) => { users += `${user} `; });
        if (users === "")
            users = "\u200b";
        embed.addField(`${key} ${reaction.title}: ${reaction.count}표`, users, false);
    });
    return embed;
}
//# sourceMappingURL=vote.js.map