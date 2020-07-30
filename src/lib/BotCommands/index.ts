import FileSystem from "fs";
import { Collection } from "discord.js";
import { Command } from "./type";

var _commandList = new Collection<string, Command>();
const commandFiles = FileSystem.readdirSync("./values").filter(value => {
	return value.endsWith(".ts");
});
for (const file of commandFiles) {
	const command: Command = require(`./values/${file}`);
	// Check disabled commands
	if (!command.options.enable) {
		console.log(`[Command][init] Disabled: ${file}`);
		continue;
	}
	console.log(`[Command][init] Enabled: ${file}`);
	_commandList.set(file, command);
}
export const CommandList = _commandList;
