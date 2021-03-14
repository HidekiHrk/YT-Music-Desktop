import DiscordRPC from "discord-rpc";

const clientId = "501544639560679477";

// DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({ transport: "ipc" });

var isReady = false;

export function setIdleActivity(activity: IdleActivity) {
    if (activity.type !== "idle" || !isReady) return;
    rpc.setActivity({
        details: `Idling...`,
        state: `And making some stuff...`,
        largeImageKey: "playing",
        largeImageText: "YouTube Music 0.1.0",
        instance: false,
    });
}

export function setMusicActivity(activity: VideoActivity) {
    if (activity.type !== "video" || !isReady || activity.title === "") return;
    rpc.setActivity({
        details: `🎶 Playing: ${activity.title}`,
        state: `🕒 ${activity.timestamp} | 👤 ${activity.channel}`,
        largeImageKey: "playing",
        largeImageText: "YouTube Music 0.1.0",
        smallImageKey: activity.playing ? "play_small" : "pause",
        smallImageText: activity.playing ? "Playing" : "Paused",
        instance: false,
    });
}

export function setSearchActivity(activity: SearchActivity) {
    if (activity.type !== "search" || !isReady) return;
    rpc.setActivity({
        details: `🔎 Searching: ${activity.query}`,
        largeImageKey: "playing",
        largeImageText: "YouTube Music 0.1.0",
        smallImageKey: "search",
        smallImageText: "Searching...",
        instance: false,
    });
}

rpc.on("ready", () => {
    isReady = true;
    console.log("Connected to Discord!");
});

rpc.login({ clientId }).catch();
