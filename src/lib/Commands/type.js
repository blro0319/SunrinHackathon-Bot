"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor(_name, _excute, _options) {
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
exports.Command = Command;
//# sourceMappingURL=type.js.map