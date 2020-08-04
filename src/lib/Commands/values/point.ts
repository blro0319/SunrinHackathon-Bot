import { Command } from "../type";
import { Message } from "discord.js";
import PointManager from "../../../Components/PointManager";
import { getUserFromMention, replyMessage } from "../../..";
import teams = require("../../Teams/teams.json");
import roles = require("../../GuildData/Roles.json");

export default new Command("point", (message: Message, args: string[]) => {
	let point = Number(args[2]);
	if (point != 0 && !point) {
		replyMessage(message, `\`${args[2]}\`은 알맞은 형식의 인자가 아닙니다. 포인트는 숫자입니다!`);
		return;
	}
	// Single
	if (args[1] != ".") {
		// Check mention
		let target = getUserFromMention(args[1]);
		if (target) {
			let team: string = "";
			for (let i in teams) {
				if (teams[i].members.find(value => value.tag === target.tag)) {
					team = teams[i].name;
					break;
				}
			}
			if (team == "") {
				replyMessage(message, `${args[1]} 님은 팀이 없습니다!`);
				return;
			}
			args[1] = team;
		}
		// Check set or add
		switch (args[0]) {
			case "set":
				PointManager.setPoint(args[1], point);
				replyMessage(message, `\`${args[1]}\`의 HP를 \`${point}HP\`로 설정했습니다!`);
				break;
			case "add":
				PointManager.addPoint(args[1], point);
				replyMessage(message, `\`${args[1]}\`의 HP에 \`${point}HP\`를 더해 \`${PointManager.getPoint(args[1])}HP\` 설정했습니다!`);
				break;
			default:
				replyMessage(message, `\`${args[0]}\`은 알맞은 형식의 인자가 아닙니다. \`set\` 또는 \`add\`로 적어주세요!`);
				return;
		}
	}
	// All
	else {
		// Check set or add
		switch (args[0]) {
			case "set":
				PointManager.setPointAll(point);
				replyMessage(message, `모두의 HP를 \`${point}HP\`로 설정했습니다!`);
				break;
			case "add":
				PointManager.addPointAll(point);
				replyMessage(message, `모두의 HP에 \`${point}HP\`를 더했습니다!`);
				break;
			default:
				replyMessage(message, `\`${args[0]}\`은 알맞은 형식의 인자가 아닙니다. \`set\` 또는 \`add\`로 적어주세요!`);
				return;
		}
	}
}, {
	aliases: ["hp", "score", "포인트", "체력", "점수"],
	description: "팀의 HP를 조절합니다.",
	enable: true,
	minArgumentCount: 3,
	showHelp: true,
	usage: '<"set"|"add"> <대상|멘션|"."> <HP>',
	permissions: {
		roles: [roles.staff]
	}
});
