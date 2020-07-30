import { Message } from "discord.js";

export interface ICommandPermission {
	users?: Array<string>;
	roles?: Array<string>;
	categories?: Array<string>;
	channels?: Array<string>;
}
export interface ICommandOption {
	enable?: boolean;
	aliases?: Array<string>;
	minArgumentCount?: number;
	usage?: string;
	description?: string;
	showHelp?: boolean;
	permissions?: ICommandPermission;
}

export class Command {
	name: string;
	excute: (message: Message, args: Array<string>) => void;
	options: ICommandOption;

	constructor (_name: string, _excute: (message: Message, args: Array<string>) => void, _options?: ICommandOption) {
		this.name = _name;
		this.excute = _excute;
		this.options = _options || {
			"enable": true,
			"aliases": [],
			"minArgumentCount": 0,
			"usage": "",
			"description": "",
			"showHelp": true
		};
	}
}
