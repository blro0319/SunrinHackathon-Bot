import bot from './bot';
import { Message, Presence } from 'discord.js';
import CommandManager from './lib/Plugins/CommandManager';

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

// On message
bot.client.on("message", (message: Message) => {
	if (message.author.bot) return;
	CommandManager.excute(message);
});

bot.login();
