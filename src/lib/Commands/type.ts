import { Message } from "discord.js";

export interface ICommandPermission {
	guilds?: string[];
	categories?: string[];
	channels?: string[];
	roles?: string[];
	users?: string[];
}
export interface ICommandOption {
	enable?: boolean;
	aliases?: string[];
	minArgumentCount?: number;
	usage?: string;
	description?: string;
	showHelp?: boolean;
	permissions?: ICommandPermission;
}

export class Command {
	name: string;
	excute: (message: Message, args: string[]) => void;
	options: ICommandOption;

	constructor (_name: string, _excute: (message: Message, args: string[]) => void, _options?: ICommandOption) {
		this.name = _name;
		this.excute = _excute;
		this.options = _options || {
			"enable": true,
			"aliases": [],
			"minArgumentCount": 0,
			"usage": "",
			"description": "",
			"showHelp": true,
			"permissions": {
				guilds: [],
				categories: [],
				channels: [],
				roles: [],
				users: []
			}
		};
	}
}
