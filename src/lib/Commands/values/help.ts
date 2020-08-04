import { Command } from "../type";
import { Message } from "discord.js";
import { CommnadList } from "..";
import { prefix } from "../../../Components/CommandManager/config.json"
import { replyMessage } from "../../..";

export default new Command("help", (message: Message, args: string[]) => {
	if (args.length) {
		if (args[0].startsWith(prefix)) args[0] = args[0].slice(prefix.length);
		let helpCmd = CommnadList.get(args[0]) || CommnadList.find((cmd) => {
			return cmd.options.aliases.length && cmd.options.aliases.includes(args[0]);
		});
		if (!helpCmd) {
			replyMessage(message, `\`${args[0]}\` 명령은 존재하지 않는 명령입니다!`);
			return;
		}
		message.channel.send(getCommandUsage(helpCmd));
	}
	else {
		let msg = `>> 명령어 목록\n\`[]\`: 선택 인자 / \`<>\`: 필수 인자\n\n`;
		CommnadList.forEach((cmd) => {
			msg += getCommandUsage(cmd);
		});
		message.channel.send(msg);
	}
}, {
	aliases: ["?", "도움", "도움말"],
	description: "명령어 목록과 사용 방법을 보여줍니다.",
	enable: true,
	minArgumentCount: 0,
	showHelp: true,
	usage: "[명령어]"
});

export function getCommandUsage(command: Command): string {
	let usage = `\`${prefix}${command.name} ${command.options.usage}\`\n`;
	if (command.options.aliases.length) {
		usage += "별명: `";
		for (let i = 0; i < command.options.aliases.length; i++) {
			usage += `${prefix}${command.options.aliases[i]}${
				i != command.options.aliases.length - 1 ? "\`, \`" : ""
			}`;
		}
		usage += "`\n";
	}
	usage += `\`\`\`${command.options.description}\`\`\`\n`;
	return usage;
}
