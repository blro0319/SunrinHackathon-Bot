"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("../type");
const __1 = require("../../..");
exports.default = new type_1.Command("cat", (message, args) => {
    __1.replyMessage(message, "냥");
}, {
    aliases: ["냥", "야옹"],
    description: "OwO",
    enable: true,
    minArgumentCount: 0,
    showHelp: true,
    usage: [""]
});
//# sourceMappingURL=cat.js.map