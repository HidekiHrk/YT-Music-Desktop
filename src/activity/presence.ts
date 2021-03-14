import DiscordRPC from "discord-rpc";

const clientId = "501544639560679477";

// DiscordRPC.register(clientId);

// const startTimestamp = new Date();

const rpc = new DiscordRPC.Client({ transport: "ipc" });

var isReady = false;

export function setMusicActivity(activity: Activity) {
    if (!isReady || activity.title === "") return;
    rpc.setActivity({
        details: `🎶 ${activity.title}`,
        state: `🕒 ${activity.timestamp} | 👤 ${activity.channel}`,
        largeImageKey: "playing",
        largeImageText: "YouTube Music 0.1.0",
        smallImageKey: "play_small",
        smallImageText: "Playing",
        instance: false,
    });
}

rpc.on("ready", () => {
    isReady = true;
    console.log("READY!!!");
});

rpc.login({ clientId }).catch();
