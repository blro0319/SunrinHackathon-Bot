import * as FileSystem from "fs";
import { Collection, Message } from "discord.js";
import { Command } from "./type";

// Command list store
let _commnadList = new Collection<string, Command>();

// Read commands in value folder
const commandFiles = FileSystem.readdirSync("./values").filter((value: string) => {
	return value.endsWith(".ts");
});
for (const file of commandFiles) {
	const command: Command = require(`./values/${file}`);

	// Check command disabled
	if (!command.options.enable) {
		console.log(`[Command][init] Disabled: ${file}`);
		continue;
	}
	console.log(`[Command][init] Enabled: ${file}`);
	_commnadList.set(file, command);
}

// Export command list
export const CommnadList = _commnadList;;
