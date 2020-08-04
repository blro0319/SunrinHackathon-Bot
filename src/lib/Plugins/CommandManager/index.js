"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = require("./config.json");
const Commands_1 = require("../../Commands");
class CommandManager {
    excute(message) {
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
    getArgs() {
        this.cmdArgs = this.message.content.slice(config_json_1.prefix.length).split(/ +/);
        this.cmdName = this.cmdArgs.shift().toLowerCase();
    }
    getCommand() {
        this.command = Commands_1.CommnadList.get(this.cmdName) || Commands_1.CommnadList.find((command) => {
            return command.options.aliases.includes(this.cmdName);
        });
    }
    // Check command availablity functions
    checkPrefix() {
        return this.message.content.startsWith(config_json_1.prefix) && !this.message.author.bot;
    }
    checkPermission() {
        let cmd = `\`${config_json_1.prefix}${this.cmdName}\``;
        if (!this.checkGuild()) {
            this.message.reply(`\`${this.message.guild.name}\` 서버에서는 \`${cmd}\` 명령을 실행할 수 없습니다!`);
            return false;
        }
        if (!this.checkCategory()) {
            this.message.reply(`\`${this.message.channel.parent.name}\` 카테고리에서는 \`${cmd}\` 명령을 실행할 수 없습니다!`);
            return false;
        }
        if (!this.checkChannel()) {
            this.message.reply(`\`${this.message.channel.name}\` 채널에서는 ${cmd} 명령을 실행할 수 없습니다!`);
            return false;
        }
        if (!this.checkRole() && this.checkUser()) {
            this.message.reply(`${cmd} 명령을 실행할 권한이 없습니다!`);
            return false;
        }
        this.command.excute(this.message, this.cmdArgs);
    }
    // Permission functions
    checkGuild() {
        let guilds = this.command.options.permissions.guilds;
        if (guilds.length <= 0 || guilds.includes(this.message.guild.id)) {
            return true;
        }
        return false;
    }
    checkCategory() {
        let category = this.message.channel.parentID;
        let categories = this.command.options.permissions.categories;
        if (categories.length <= 0 || categories.includes(category)) {
            return true;
        }
        return false;
    }
    checkChannel() {
        let channels = this.command.options.permissions.channels;
        if (channels.length <= 0 || channels.includes(this.message.channel.id)) {
            return true;
        }
        return false;
    }
    checkRole() {
        let roles = this.command.options.permissions.roles;
        if (roles.length <= 0)
            return true;
        for (let role in roles) {
            if (this.message.member.roles.cache.some((userRole) => {
                return userRole.id === role;
            }))
                return true;
        }
        return false;
    }
    checkUser() {
        let users = this.command.options.permissions.users;
        let user = this.message.author.id;
        if (users.length <= 0 ||
            users.includes(user) ||
            user === this.message.guild.ownerID) {
            return true;
        }
        return false;
    }
}
exports.default = new CommandManager();
//# sourceMappingURL=index.js.map