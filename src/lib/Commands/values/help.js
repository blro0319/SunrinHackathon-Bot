"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommandUsage = void 0;
const type_1 = require("../type");
const __1 = require("..");
const config_json_1 = require("../../../Components/CommandManager/config.json");
const __2 = require("../../..");
exports.default = new type_1.Command("help", (message, args) => {
    if (args.length) {
        args[0] = args[0].toLowerCase();
        if (args[0].startsWith(config_json_1.prefix))
            args[0] = args[0].slice(config_json_1.prefix.length);
        let helpCmd = __1.CommnadList.get(args[0]) || __1.CommnadList.find((cmd) => {
            return cmd.options.aliases.length && cmd.options.aliases.includes(args[0]);
        });
        if (!helpCmd) {
            __2.replyMessage(message, `\`${args[0]}\` 명령은 존재하지 않는 명령입니다!`);
            return;
        }
        message.channel.send(getCommandUsage(helpCmd));
    }
    else {
        let msg = `**명령어 목록**\n\`[]\`: 선택 인자 / \`<>\`: 필수 인자\n\n`;
        __1.CommnadList.forEach((cmd) => {
            msg += getCommandUsage(cmd);
        });
        message.channel.send(msg);
    }
}, {
    aliases: ["?", "도움", "도움말"],
    description: "명령어 목록과 사용 방법을 보여줍니다.",
    enable: true,
    minArgumentCount: 0,
    showHelp: true,
    usage: ["[명령어]"]
});
function getCommandUsage(command) {
    let usage = "";
    command.options.usage.forEach((value) => {
        usage += `\`${config_json_1.prefix}${command.name} ${value}\`\n`;
    });
    if (command.options.aliases.length) {
        usage += "별명: `";
        for (let i = 0; i < command.options.aliases.length; i++) {
            usage += `${config_json_1.prefix}${command.options.aliases[i]}${i != command.options.aliases.length - 1 ? "\`, \`" : ""}`;
        }
        usage += "`\n";
    }
    usage += `\`\`\`${command.options.description}\`\`\`\n`;
    return usage;
}
exports.getCommandUsage = getCommandUsage;
//# sourceMappingURL=help.js.map