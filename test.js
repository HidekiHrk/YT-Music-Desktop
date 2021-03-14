const DiscordRPC = require("discord-rpc");

const clientId = "501544639560679477";

DiscordRPC.register(clientId);

const startTimestamp = new Date();

const rpc = new DiscordRPC.Client({ transport: "ipc" });

var isReady = false;

function setMusicActivity() {
    if (!isReady) return;
    rpc.setActivity({
        details: "TESTEEE",
        state: "TESTE2",
        startTimestamp,
        largeImageKey: "playing",
        largeImageText: "YouTube Music 0.1.0",
        smallImageKey: "play_small",
        smallImageText: "Playing",
        instance: false,
    });
}

rpc.on("ready", () => {
    isReady = true;
    setMusicActivity();
    console.log("READY!!!");
});
