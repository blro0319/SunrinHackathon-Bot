export interface ICommandPermission {
	users?: Array<string>;
	roles?: Array<string>;
	categories?: Array<string>;
	channels?: Array<string>;
}

export interface ICommandOption {
	aliases?: Array<string>;
	minArgumentCount?: number;
	usage?: string;
	description?: string;
	showHelp?: boolean;
}

export default class Command {
	name: string;
	options: ICommandOption;
	permissions: ICommandPermission;

	constructor (_name: string, _options?: ICommandOption, _permissions?: ICommandPermission) {
		this.name = _name;
		this.options = _options || {
			"aliases": [],
			"minArgumentCount": 0,
			"usage": "",
			"description": "",
			"showHelp": true
		};
		this.permissions = _permissions || {
			"users": [],
			"roles": [],
			"categories": [],
			"channels": []
		};
	}
}
