import config from "./config.json";
import { Message, GuildChannel } from "discord.js";
import { CommandList } from "../../lib/BotCommands";
import { Command } from "../../lib/BotCommands/type";

class CommandManager {
	private message: Message;
	private name: string;
	private args: Array<string>;
	private command: Command;

	// Excute command
	excute(message: Message) {
		this.message = message;
		if (!this.checkPrefix()) return;
		this.getArgs();
		this.getCommand();
		if (!this.command || !this.checkPermission) return;
		this.command.excute(message, this.args);
	}

	// Get command form message
	private getArgs() {
		this.args = this.message.content.slice(config.prefix.length).split(/ +/);
		this.name = this.args.shift().toLowerCase();
	}
	private getCommand(): Command | null {
		this.command = CommandList.get(this.name) || CommandList.find((cmd) => {
			return cmd.options.aliases.includes(this.name);
		});
		return this.command;
	}

	// Check command availablity functions
	private checkPrefix(): boolean {
		return this.message.content.startsWith(config.prefix) &&
		       !this.message.author.bot;
	}
	private checkPermission(): boolean {
		if (this.checkUser() || this.checkRole()) {
			let checkChannel = this.checkChannel();
			let checkCategory = this.checkCatetory();
			let channel = this.message.channel as GuildChannel;

			if (checkCategory && checkChannel) return true;
			else if (!checkChannel) {
				this.message.reply(`\`${channel.name}\` 채널 에서는 \`${config.prefix}${this.name}\` 명령을 실행할 수 없습니다!`);
			} else if (!checkCategory) {
				this.message.reply(`\`${channel.parent.name}\` 카테고리 에서는 \`${config.prefix}${this.name}\` 명령을 실행할 수 없습니다!`);
			}
			return false;
		}
		this.message.reply(`\`${config.prefix}${this.name}\` 명령을 실행할 권한이 없습니다!`);
		return false;
	}

	// Permission functions
	private checkCatetory(): boolean {
		let channel = this.message.channel as GuildChannel;
		if (
			this.command.options.permissions.categories.length <= 0 ||
			this.command.options.permissions.categories.includes(channel.parentID)
		) return true;
		return false;
	}
	private checkChannel(): boolean {
		if (
			this.command.options.permissions.channels.length <= 0 ||
			this.command.options.permissions.channels.includes(this.message.channel.id)
		) return true;
		return false;
	}
	private checkRole(): boolean {
		if (this.command.options.permissions.roles.length <= 0) return true;
		for (let role in this.command.options.permissions.roles) {
			if (this.message.member.roles.cache.some((userRole) => {
				return userRole.id === role;
			})) return true;
		}
		return false;
	}
	private checkUser(): boolean {
		if (
			this.command.options.permissions.users.length <= 0 ||
			this.message.author.id == this.message.guild.ownerID ||
			this.command.options.permissions.users.includes(this.message.author.id)
		) return true;
		return false;
	}
}
export default new CommandManager();
