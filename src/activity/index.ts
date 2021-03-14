import { ipcMain } from "electron";
import { IpcMainEvent } from "electron/main";
import { JSDOM } from "jsdom";

var lastActivity: Activity = {
    title: "",
    channel: "",
    thumbnailUrl: "",
    timestamp: "",
};

const observer: Observer = {
    register: (callback: (activity: Activity) => void) => {
        observer.listeners.push(callback);
        return {
            unregister: () => {
                const index = observer.listeners.indexOf(callback);
                if (index !== -1) {
                    observer.listeners.splice(index, 1);
                }
            },
        };
    },
    listeners: [],
};

const selectors = {
    title:
        "#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > yt-formatted-string",
    thumbnail:
        "#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > img",
    channel:
        "#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > span > span.subtitle.style-scope.ytmusic-player-bar > yt-formatted-string > a",
};

function checkActivityEquality(obj1: Activity, obj2: Activity) {
    const duplicates = ["title", "channel", "thumbnailUrl"].filter(
        (value: "title" | "channel" | "thumbnailUrl") => {
            return obj2[value] === obj1[value];
        }
    );
    return !!duplicates.length;
}

function notifyAllListeners() {
    for (let listener of observer.listeners) {
        listener(lastActivity);
    }
}

ipcMain.on("newContents", (event: IpcMainEvent, obj: VideoRawObject) => {
    const dom = new JSDOM(obj.html);
    const title = dom.window.document.querySelector(selectors.title)?.innerHTML;
    if (!title) return;
    const thumbnailUrl = dom.window.document
        .querySelector(selectors.thumbnail)
        ?.getAttribute("src");
    if (!thumbnailUrl) return;
    const channel = dom.window.document.querySelector(selectors.channel)
        ?.innerHTML;
    if (!channel) return;
    const newActivity = {
        title,
        thumbnailUrl,
        channel,
    };
    if (!checkActivityEquality(lastActivity, newActivity)) {
        lastActivity = { ...lastActivity, ...newActivity };
        notifyAllListeners();
    }
});

ipcMain.on("timeChange", (event: IpcMainEvent, timeString: string) => {
    const activityObj = { timestamp: timeString };
    lastActivity = { ...lastActivity, ...activityObj };
    notifyAllListeners();
});

export default observer;
