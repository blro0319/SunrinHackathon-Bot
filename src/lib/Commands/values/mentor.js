"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("../type");
const roles = require("../../../lib/GuildData/Roles.json");
exports.default = new type_1.Command("mentor", (message, args) => {
}, {
    aliases: ["멘토"],
    description: "팀 멘토링을 시작합니다. 멘토 이상만 사용할 수 있습니다.",
    enable: true,
    minArgumentCount: 4,
    showHelp: true,
    usage: ['<이름|멘션> <"start"|"시작">', '<이름|멘션> <"end"|"종료"|"끝">'],
    permissions: {
        roles: [roles.admin, roles.staff, roles.mentor]
    }
});
//# sourceMappingURL=mentor.js.map