import { Message, GuildChannel } from "discord.js";
import { prefix } from "./config.json";
import { CommnadList } from "../../lib/Commands";
import { Command } from "../../lib/Commands/type";
import { replyMessage } from "../..";

class CommandManager {
	private message: Message;
	private cmdName: string;
	private cmdArgs: string[];
	private command: Command;

	excute(message: Message) {
		this.message = message;
		if (!this.checkPrefix()) {
			this.message = null;
			return;
		}
		this.getArgs();
		this.getCommand();
		if (!this.command || !this.checkPermission()) {
			this.message = this.cmdName = this.cmdArgs = this.command = null;
			return;
		}
		if (!this.checkArgs()) {
			return;
		}
		this.command.excute(this.message, this.cmdArgs);
		this.message = this.cmdName = this.cmdArgs = this.command = null;
	}

	// Get command from message
	private getArgs() {
		this.cmdArgs = this.message.content.slice(prefix.length).split(/ +/);
		this.cmdName = this.cmdArgs.shift().toLowerCase();
	}
	private getCommand() {
		this.command = CommnadList.get(this.cmdName) || CommnadList.find((command) => {
			return command.options.aliases.includes(this.cmdName);
		});
	}

	// Check command availablity functions
	private checkPrefix(): boolean {
		return this.message.content.startsWith(prefix) && !this.message.author.bot;
	}
	private checkPermission(): boolean {
		let cmd: string = `\`${prefix}${this.cmdName}\``;

		if (!this.checkGuild()) {
			replyMessage(this.message, `\`${this.message.guild.name}\` 서버에서는 \`${cmd}\` 명령을 실행할 수 없습니다!`);
			return false;
		}
		if (!this.checkCategory()) {
			replyMessage(this.message, `\`${(this.message.channel as GuildChannel).parent.name}\` 카테고리에서는 \`${cmd}\` 명령을 실행할 수 없습니다!`);
			return false;
		}
		if (!this.checkChannel()) {
			replyMessage(this.message, `\`${(this.message.channel as GuildChannel).name}\` 채널에서는 ${cmd} 명령을 실행할 수 없습니다!`);
			return false;
		}
		if (!this.checkRole() && this.checkUser()) {
			replyMessage(this.message, `${cmd} 명령을 실행할 권한이 없습니다!`);
			return false;
		}
		return true;
	}
	private checkArgs(): boolean {
		if (this.cmdArgs.length < this.command.options.minArgumentCount) {
			replyMessage(this.message, `\`${prefix}${this.cmdName}\` 명령에 실행에 필요한 인자가 부족합니다!`);
			return false;
		}
		return true;
	}

	// Permission functions
	private checkGuild(): boolean {
		let guilds = this.command.options.permissions?.guilds || [];
		if (guilds.length <= 0 || guilds.includes(this.message.guild.id)) {
			return true;
		}
		return false;
	}
	private checkCategory(): boolean {
		let categories = this.command.options.permissions?.categories || [];
		let category = (this.message.channel as GuildChannel).parentID;
		if (categories.length <= 0 || categories.includes(category)) {
			return true;
		}
		return false;
	}
	private checkChannel(): boolean {
		let channels = this.command.options.permissions?.channels || [];
		if (channels.length <= 0 || channels.includes(this.message.channel.id)) {
			return true;
		}
		return false;
	}
	private checkRole(): boolean {
		let roles = this.command.options.permissions?.roles || [];
		if (roles.length <= 0) return true;
		for (let role in roles) {
			if (
				this.message.author.id === this.message.guild.ownerID ||
				this.message.member.roles.cache.some((userRole) => {
					return userRole.id === roles[role];
				})
			) return true;
		}
		return false;
	}
	private checkUser(): boolean {
		let users = this.command.options.permissions?.users || [];
		let user = this.message.author.id;
		if (
			users.length <= 0 ||
			users.includes(user) ||
			user === this.message.guild.ownerID
		) {
			return true;
		}
		return false;
	}
}
export default new CommandManager();
