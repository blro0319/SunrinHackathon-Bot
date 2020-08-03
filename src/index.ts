import bot from './bot';
import { Message, Presence } from 'discord.js';

// On ready
bot.client.on("ready", () => {
	// Set status
	bot.client.user.setActivity({
		type: "PLAYING",
		name: ":video_game: 선린해커톤"
	}).then((value: Presence) => {
		console.log(`[Bot][init] Set activity: ${value.activities[0].name}`);
	}).catch(console.error);

	// Login discord client
	console.log(`[Bot][init] Logged in: ${bot.client.user.tag}`);
});

// On message
bot.client.on("message", (message: Message) => {
});

bot.login();
