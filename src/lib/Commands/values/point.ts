import { Command } from "../type";
import { Message, MessageEmbed } from "discord.js";
import PointManager from "../../../Components/PointManager";
import { getUserFromMention, replyMessage, getRoleFromMention, numberFormat } from "../../..";
import teams = require("../../Teams/teams.json");
import roles = require("../../GuildData/Roles.json");

export default new Command("point", (message: Message, args: string[]) => {
	switch (args[0]) {
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
			replyMessage(message, `\`${args[0]}\`은 알맞은 형식의 인자가 아닙니다. \`set\` 또는 \`add\` 또는 \`get\`로 적어주세요!`);
			return;
	}
}, {
	aliases: ["hp", "score", "포인트", "체력", "점수"],
	description: "팀의 HP를 조절합니다.",
	enable: true,
	minArgumentCount: 2,
	showHelp: true,
	usage: '<"set"|"설정"|"변경"|"add"|"추가"|"get"|"보기"> <대상|멘션|"."> <HP>',
	permissions: {
		roles: [roles.admin, roles.staff]
	}
});

function setScore(message: Message, target: string, point: string) {
	if (Number.isNaN(Number(point))) {
		replyMessage(message, `\`${point}\` 인자는 알맞은 형식이 아닙니다. HP는 숫자입니다!`);
		return;
	}

	// All
	if (target === ".") {
		PointManager.setPointAll(Number(point));
		replyMessage(message, `모두의 HP를 \`${numberFormat(Number(point))}HP\`로 설정했습니다!`);
	}
	// Single
	else {
		// Check mention
		let user = getUserFromMention(target);
		if (user) {
			let team: string = "";
			for (let i in teams) {
				if (teams[i].members.find(value => value.tag === user.tag)) {
					team = teams[i].name;
					break;
				}
			}
			if (team == "") {
				replyMessage(message, `${target} 님은 팀이 없습니다!`);
				return;
			}
			target = team;
		} else {
			let role = getRoleFromMention(message.guild, target);
			if (role) {
				let team: string = "";
				for (let i in teams) {
					if (teams[i].name === role.name) {
						team = teams[i].name;
						break;
					}
				}
				if (team == "") {
					replyMessage(message, `${target} 역할은 팀이 아닙니다!`);
					return;
				}
				target = team;
			}
		}
		PointManager.setPoint(target, Number(point));
		replyMessage(message, `\`${target}\`의 HP를 \`${numberFormat(Number(point))}HP\`로 설정했습니다!`);
		getScore(message, target);
	}
}
function addScore(message: Message, target: string, point: string) {
	if (Number.isNaN(Number(point))) {
		replyMessage(message, `\`${point}\` 인자는 알맞은 형식이 아닙니다. HP는 숫자입니다!`);
		return;
	}

	// All
	if (target === ".") {
		PointManager.addPointAll(Number(point));
		replyMessage(message, `모두의 HP에 \`${numberFormat(Number(point))}HP\`를 더했습니다!`);
	}
	// Single
	else {
		// Check mention
		let user = getUserFromMention(target);
		if (user) {
			let team: string = "";
			for (let i in teams) {
				if (teams[i].members.find(value => value.tag === user.tag)) {
					team = teams[i].name;
					break;
				}
			}
			if (team == "") {
				replyMessage(message, `${target} 님은 팀이 없습니다!`);
				return;
			}
			target = team;
		} else {
			let role = getRoleFromMention(message.guild, target);
			if (role) {
				let team: string = "";
				for (let i in teams) {
					if (teams[i].name === role.name) {
						team = teams[i].name;
						break;
					}
				}
				if (team == "") {
					replyMessage(message, `${target} 역할은 팀이 아닙니다!`);
					return;
				}
				target = team;
			}
		}
		PointManager.addPoint(target, Number(point));
		replyMessage(message, `\`${target}\`의 HP에 \`${numberFormat(Number(point))}HP\`를 더해 \`${numberFormat(PointManager.getPoint(target))}HP\`로 설정했습니다!`);
		getScore(message, target);
	}
}
function getScore(message: Message, target: string) {
	// Check mention
	let user = getUserFromMention(target);
	if (user) {
		let team: string = "";
		for (let i in teams) {
			if (teams[i].members.find(value => value.tag === user.tag)) {
				team = teams[i].name;
				break;
			}
		}
		if (team == "") {
			replyMessage(message, `${target} 님은 팀이 없습니다!`);
			return;
		}
		target = team;
	} else {
		let role = getRoleFromMention(message.guild, target);
		if (role) {
			let team: string = "";
			for (let i in teams) {
				if (teams[i].name === role.name) {
					team = teams[i].name;
					break;
				}
			}
			if (team == "") {
				replyMessage(message, `${target} 역할은 팀이 아닙니다!`);
				return;
			}
			target = team;
		}
	}

	// Send result
	let point = PointManager.getPoint(target);
	message.channel.send(
		new MessageEmbed()
			.setColor("#e61f71")
			.setTitle(`${target}의 HP`)
			.addField(PointManager.pointToIcon(point), `${numberFormat(point)}HP`)
	);
}
