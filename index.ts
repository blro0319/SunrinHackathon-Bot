import Discord from "discord.js";
import FileSystem from "fs";
import config from "./config.json";
const client = new Discord.Client();

// Load commands
var commands = new Discord.Collection();
const commandFiles = FileSystem.readdirSync("./commands").filter((value: string) => {
	value.endsWith(".ts");
});
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// Check disabled commands
	if (command.disable) {
		console.log(`[Command] Disabled: ${file}`);
		continue;
	}

	console.log(`[Command] Enabled: ${file}`);
	commands.set(command.name, command);
}

client.on("ready", () => {
	// Set profile avtivity
	client.user.setActivity("제6회 선린톤");
	console.log(`[System] Discord logged in ${client.user.tag}!`);
});

client.login(config.token);
