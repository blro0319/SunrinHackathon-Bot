import { Command } from "../type";
import { Message } from "discord.js";
import { replyMessage } from "../../..";

export default new Command("cat", (message: Message, args: string[]) => {
	replyMessage(message, "냥");
}, {
	aliases: ["냥", "야옹"],
	description: "OwO",
	enable: true,
	minArgumentCount: 0,
	showHelp: true,
	usage: [""]
});
