import { Command } from "../type";
import { Message } from "discord.js";

export default new Command("help", (message: Message, args: string[]) => {

}, {
	aliases: ["?", "도움", "도움말"],
	description: "명령어 목록과 사용 방법을 보여줍니다.",
	enable: true,
	minArgumentCount: 0,
	showHelp: true,
	usage: "[명령어]"
})
