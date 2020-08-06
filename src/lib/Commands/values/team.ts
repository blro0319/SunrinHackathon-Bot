import { Command } from "../type";
import { getScore } from "./point";
import { getTeamFromMention, isMention, replyMessage } from "../../..";
import { ITeam } from "../../Teams/type";
import teams = require("../../Teams/teams.json");
import { MessageEmbed, Message } from "discord.js";

export default new Command("team", (message, args) => {
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
function changeTeamColor(message: Message, target: string, color: string) {
	let team: ITeam;
	if (getTeamFromMention(message, target) != null) {
		team = getTeamFromMention(message, target);
	}
	else if (isMention(target)) return;
	else {
		teams.forEach((value) => {
			if (target === value.name) {
				team = value;
				return;
			}
		});
		if (!team) {
			replyMessage(message, `${target} 팀은 존재하지 않습니다!`);
			return;
		}
	}

	if (!/#[0-9a-fA-F]{6}/.test(color)) {
		replyMessage(message, `${color} 인수는 올바른 형식의 색이 아닙니다. \`#000000\`의 형식으로 적어주세요!`);
		return;
	}
	let role = message.guild.roles.cache.find((role) => role.name === team.name);
	color = /#[0-9a-fA-F]{6}/.exec(color)[0];
	role.setColor(color);
	replyMessage(message, `${role} 팀의 색을 ${color}로 변경했습니다!`);
}

// Send team info
function showTeamInfo(message: Message, target: string) {
	if (!target)  {
		target = message.author.toString();
	}

	let team: ITeam = null;
	// Check mention
	if (getTeamFromMention(message, target) != null) {
		team = getTeamFromMention(message, target);
	}
	else if (isMention(target)) return;
	else {
		teams.forEach((value) => {
			if (target === value.name) {
				team = value;
				return;
			}
		});
		if (!team) {
			replyMessage(message, `${target} 팀은 존재하지 않습니다!`);
			return;
		}
	}

	let role = message.guild.roles.cache.find((role) => role.name === team.name);
	let info = new MessageEmbed()
		.setColor(role.color)
		.setTitle(`${team.name} 팀`)
		.setDescription(`${team.type}`);
	team.members.forEach((member, index) => {
		info.addField(member.name, member.role, index != 0);
	});
	message.channel.send(info);
	getScore(message, team.name);
}
