"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require("dotenv").config();
class Bot {
    constructor() {
        this.client = new discord_js_1.Client();
    }
    login() {
        this.client.login(process.env.TOKEN);
    }
}
exports.default = new Bot();
//# sourceMappingURL=bot.js.map