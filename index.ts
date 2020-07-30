import Discord from "discord.js";
import config from "./config.json";
import CommandManager from "./src/plugins/BotCommand";
const client = new Discord.Client();

client.on("ready", () => {
	// Set profile avtivity
	client.user.setActivity("제6회 선린톤");
	console.log(`[System] Discord logged in ${client.user.tag}!`);
});

client.on("message", (message) => {
	CommandManager.excute(message);
});

client.login(config.token);
