import { Client } from "discord.js";

require("dotenv").config();

class Bot {
	readonly client: Client;

	constructor() {
		this.client = new Client();
	}

	login() {
		this.client.login(process.env.TOKEN);
	}
}
export default new Bot();
