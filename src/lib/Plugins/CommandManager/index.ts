import { Message, GuildChannel } from "discord.js";
import { prefix } from "./config.json";
import { CommnadList } from "../../Commands";
import { Command } from "../../Commands/type";

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
		if (!this.command || !this.checkPermission) {
			this.message = this.cmdName = this.cmdArgs = this.command = null;
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
			this.message.reply(`\`${this.message.guild.name}\` 서버에서는 \`${cmd}\` 명령을 실행할 수 없습니다!`);
			return false;
		}
		if (!this.checkCategory()) {
			this.message.reply(`\`${(this.message.channel as GuildChannel).parent.name}\` 카테고리에서는 \`${cmd}\` 명령을 실행할 수 없습니다!`);
			return false;
		}
		if (!this.checkChannel()) {
			this.message.reply(`\`${(this.message.channel as GuildChannel).name}\` 채널에서는 ${cmd} 명령을 실행할 수 없습니다!`);
			return false;
		}
		if (!this.checkRole() && this.checkUser()) {
			this.message.reply(`${cmd} 명령을 실행할 권한이 없습니다!`);
			return false;
		}

		this.command.excute(this.message, this.cmdArgs);
	}

	// Permission functions
	private checkGuild(): boolean {
		let guilds = this.command.options.permissions.guilds;
		if (guilds.length <= 0 || guilds.includes(this.message.guild.id)) {
			return true;
		}
		return false;
	}
	private checkCategory(): boolean {
		let category = (this.message.channel as GuildChannel).parentID;
		let categories = this.command.options.permissions.categories;
		if (categories.length <= 0 || categories.includes(category)) {
			return true;
		}
		return false;
	}
	private checkChannel(): boolean {
		let channels = this.command.options.permissions.channels;
		if (channels.length <= 0 || channels.includes(this.message.channel.id)) {
			return true;
		}
		return false;
	}
	private checkRole(): boolean {
		let roles = this.command.options.permissions.roles;
		if (roles.length <= 0) return true;
		for (let role in roles) {
			if (this.message.member.roles.cache.some((userRole) => {
				return userRole.id === role;
			})) return true;
		}
		return false;
	}
	private checkUser(): boolean {
		let users = this.command.options.permissions.users;
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
