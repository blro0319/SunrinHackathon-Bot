"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./bot");
// On ready
bot_1.default.client.on("ready", () => {
    // Set status
    bot_1.default.client.user.setActivity({
        type: "PLAYING",
        name: ":video_game: 선린해커톤"
    }).then((value) => {
        console.log(`[Bot][init] Set activity: ${value.activities[0].name}`);
    }).catch(console.error);
    // Login discord client
    console.log(`[Bot][init] Logged in: ${bot_1.default.client.user.tag}`);
});
// On message
bot_1.default.client.on("message", (message) => {
});
bot_1.default.login();
//# sourceMappingURL=index.js.map