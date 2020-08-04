"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = require("./config.json");
const Commands_1 = require("../../lib/Commands");
const __1 = require("../..");
class CommandManager {
    excute(message) {
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
            __1.replyMessage(this.message, `\`${this.message.guild.name}\` 서버에서는 \`${cmd}\` 명령을 실행할 수 없습니다!`);
            return false;
        }
        if (!this.checkCategory()) {
            __1.replyMessage(this.message, `\`${this.message.channel.parent.name}\` 카테고리에서는 \`${cmd}\` 명령을 실행할 수 없습니다!`);
            return false;
        }
        if (!this.checkChannel()) {
            __1.replyMessage(this.message, `\`${this.message.channel.name}\` 채널에서는 ${cmd} 명령을 실행할 수 없습니다!`);
            return false;
        }
        if (!this.checkRole() && this.checkUser()) {
            __1.replyMessage(this.message, `${cmd} 명령을 실행할 권한이 없습니다!`);
            return false;
        }
        return true;
    }
    checkArgs() {
        if (this.cmdArgs.length < this.command.options.minArgumentCount) {
            __1.replyMessage(this.message, `\`${config_json_1.prefix}${this.cmdName}\` 명령에 실행에 필요한 인자가 부족합니다!`);
            return false;
        }
        return true;
    }
    // Permission functions
    checkGuild() {
        var _a;
        let guilds = ((_a = this.command.options.permissions) === null || _a === void 0 ? void 0 : _a.guilds) || [];
        if (guilds.length <= 0 || guilds.includes(this.message.guild.id)) {
            return true;
        }
        return false;
    }
    checkCategory() {
        var _a;
        let categories = ((_a = this.command.options.permissions) === null || _a === void 0 ? void 0 : _a.categories) || [];
        let category = this.message.channel.parentID;
        if (categories.length <= 0 || categories.includes(category)) {
            return true;
        }
        return false;
    }
    checkChannel() {
        var _a;
        let channels = ((_a = this.command.options.permissions) === null || _a === void 0 ? void 0 : _a.channels) || [];
        if (channels.length <= 0 || channels.includes(this.message.channel.id)) {
            return true;
        }
        return false;
    }
    checkRole() {
        var _a;
        let roles = ((_a = this.command.options.permissions) === null || _a === void 0 ? void 0 : _a.roles) || [];
        if (roles.length <= 0)
            return true;
        for (let role in roles) {
            if (this.message.author.id === this.message.guild.ownerID ||
                this.message.member.roles.cache.some((userRole) => {
                    return userRole.id === roles[role];
                }))
                return true;
        }
        return false;
    }
    checkUser() {
        var _a;
        let users = ((_a = this.command.options.permissions) === null || _a === void 0 ? void 0 : _a.users) || [];
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