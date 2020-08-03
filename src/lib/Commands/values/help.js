"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("../type");
exports.default = new type_1.Command("help", (message, args) => {
}, {
    aliases: ["?", "도움", "도움말"],
    description: "명령어 목록과 사용 방법을 보여줍니다.",
    enable: true,
    minArgumentCount: 0,
    showHelp: true,
    usage: "[명령어]"
});
//# sourceMappingURL=help.js.map