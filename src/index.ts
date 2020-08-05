import bot from './bot';
import { Message, Presence, GuildMember, User, MessageReaction, Role, Guild, Channel } from 'discord.js';
import CommandManager from './Components/CommandManager';
import teams = require("./lib/Teams/teams.json");
import roles = require("./lib/GuildData/Roles.json");

// Bot init //
// On ready
bot.client.on("ready", () => {
	// Set status
	bot.client.user.setActivity({
		type: "PLAYING",
		name: ">help로 도움말 보기"
	}).then((value: Presence) => {
		console.log(`[Bot][init] Set activity: ${value.activities[0].name}`);
	}).catch(console.error);

	// Login discord client
	console.log(`[Bot][init] Logged in: ${bot.client.user.tag}`);
});

bot.client.on("guildMemberAdd", (member: GuildMember) => {
	detectAddMember(member);
});

// On message
bot.client.on("message", (message: Message) => {
	if (message.author.bot) return;
	CommandManager.excute(message);
});

// Login
bot.login();

// Functions //
// On member add
function detectAddMember(member: GuildMember) {
	// Member added
	console.log(`[Guild][user] Add: ${member.user.tag}`);

	// Get data
	let teamData: { name: string, type: string, members: { name: string, role: string, tag: string }[] };
	let userData: { name: string, role: string, tag: string };
	for (let i in teams) {
		userData = teams[i].members.find(value => value.tag === member.user.tag);
		if (userData) {
			teamData = teams[i];
			break;
		}
	}
	if (!userData) return;

	// New member is player
	console.log(`[Guild][user] ${member.user.tag} is player: ${teamData.name}: ${userData.name}_${userData.role}`);
	// Add roles
	let guildRoles = member.guild.roles.cache;
	member.roles.add(guildRoles.find(value => value.id === roles.player));
	member.roles.add(guildRoles.find(value => value.name === teamData.name));
	member.roles.add(guildRoles.find(value => value.name === teamData.type))
	member.roles.add(guildRoles.find(value => value.name === userData.role));
}

// Custom message reply
export async function replyMessage(message: Message, content: string): Promise<Message> {
	let result: Message;
	await message.channel.send(`> ${message.content.replace(/\n/g, "\n> ")}\n${message.author} ${content}`).then(value => {
		result = value;
	});
	return result;
}

// Get user by mention
export function getUserFromMention(mention: string): User {
	if (!mention) return;

	if (mention.startsWith("<@") && mention.endsWith(">")) {
		mention = mention.slice(2, -1);

		if (mention.startsWith("!")) {
			mention = mention.slice(1);
		}

		return bot.client.users.cache.get(mention);
	}
}
// Get role by mention
export function getRoleFromMention(guild: Guild, mention: string): Role {
	if (!mention) return;

	if (mention.startsWith("<@&") && mention.endsWith(">")) {
		mention = mention.slice(3, -1);
	}
	return guild.roles.cache.get(mention);
}
