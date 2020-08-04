import { Command } from "../type";
import { Message } from "discord.js";
import { CommnadList } from "..";

export default new Command("help", (message: Message, args: string[]) => {
	if (args.length) {
		let helpCmd = CommnadList.get(args[0]) || CommnadList.find((cmd) => {
			return cmd.options.aliases.length && cmd.options.aliases.includes(args[0]);
		});
		if (!helpCmd) return;
	}
}, {
	aliases: ["?", "도움", "도움말"],
	description: "명령어 목록과 사용 방법을 보여줍니다.",
	enable: true,
	minArgumentCount: 0,
	showHelp: true,
	usage: "[명령어]"
});
