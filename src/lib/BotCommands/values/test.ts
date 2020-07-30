import { Command } from "../type";

export default new Command("test", (message, args) => {
	message.reply("명령 실행 테스트");
	console.log(`[Command][test] ${args}`);
}, {
	"aliases": ["테스트"],
	"description": "명령어 기능 확인"
});
