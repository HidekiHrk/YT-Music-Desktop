import { ipcMain } from "electron";
import { IpcMainEvent } from "electron/main";

var lastActivity: Activity = {
    type: "idle",
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

function checkActivityEquality(activity1: Activity, activity2: Activity) {
    const keys = Object.keys(activity2);
    const duplicates = keys.filter((value: any) => {
        const obj1: any = activity1;
        const obj2: any = activity2;
        return obj1[value] === obj2[value];
    });
    return duplicates.length === keys.length;
}

function notifyAllListeners() {
    for (let listener of observer.listeners) {
        listener(lastActivity);
    }
}

ipcMain.on("newContents", (_: IpcMainEvent, obj: VideoRawObject) => {
    const re = /search\?q=.+/;
    const { title, thumbnail: thumbnailUrl, channel, playing } = obj.elements;
    if (re.test(obj.url) && obj.elements.search && !playing) {
        const newActivity: SearchActivity = {
            type: "search",
            query: obj.elements.search || "",
        };
        lastActivity = newActivity;
        return notifyAllListeners();
    } else if (title && thumbnailUrl && channel) {
        const newActivity: VideoActivity = {
            type: "video",
            title,
            thumbnailUrl,
            channel,
            playing,
        };
        if (!checkActivityEquality(lastActivity, newActivity)) {
            const tempActivity: any = lastActivity;
            lastActivity = {
                timestamp: tempActivity?.timestamp,
                ...newActivity,
            };
            return notifyAllListeners();
        }
    } else if (lastActivity.type !== "idle") {
        lastActivity = {
            type: "idle",
        };
        notifyAllListeners();
    }
});

ipcMain.on("timeChange", (_: IpcMainEvent, timeString: string) => {
    const activityObj = {
        timestamp: timeString,
    };
    lastActivity = { ...lastActivity, ...activityObj };
    notifyAllListeners();
});

export default observer;
