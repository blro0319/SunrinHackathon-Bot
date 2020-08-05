import { Command } from "../type";
import { Message } from "discord.js";
import roles = require("../../GuildData/Roles.json");
import { replyMessage } from "../../..";
import voteList = require("../data/vote/list.json");
import voteResult = require("../data/vote/result.json");

export interface IVoteItem {
	emoji?: string;
	title?: string;
}
export interface IVote {
	name?: string;
	description?: string;
	type?: string;
	items?: IVoteItem[];
}

export default new Command("vote", (message: Message, args: string[]) => {
	switch (args[1]) {
		case "create":
			createVote(message, args[1]);
			break;
		case "close":
			closeVote(args[1]);
			break;
		default:
			replyMessage(message, `\`${args[0]}\`은 알맞은 형식의 인자가 아닙니다. \`create\` 또는 \`close\`로 적어주세요!`);
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

function createVote(message: Message, name: string) {
	let vote: IVote = {
		name: name
	};
	replyMessage(message, "설명을 적어주세요.");
	// 컬렉션으로 가져오기s
}
function closeVote(name: string) {
	console.log(voteList[name]);
}
