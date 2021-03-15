import { ipcMain } from "electron";
import { IpcMainEvent } from "electron/main";

var lastActivity: Activity = {
    type: "idle",
};

var lastNotification: NotificationActivity = {
    type: "notification",
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

function checkNotificationEquality(
    activity1: NotificationActivity,
    activity2: NotificationActivity
) {
    try {
        const keys = Object.keys(activity2.info);
        const duplicates = keys.filter((value: any) => {
            const obj1: any = activity1.info;
            const obj2: any = activity2.info;
            return obj1[value] === obj2[value];
        });
        return duplicates.length === keys.length;
    } catch (e) {
        return false;
    }
}

function notifyAllListeners(activity: Activity) {
    for (let listener of observer.listeners) {
        listener(activity);
    }
}

function onVideoRaw(obj: VideoRawObject) {
    const re = /search\?q=.+/;
    const { title, thumbnail: thumbnailUrl, channel, playing } = obj.elements;
    if (re.test(obj.url) && obj.elements.search && !playing) {
        const newActivity: SearchActivity = {
            type: "search",
            query: obj.elements.search || "",
        };
        lastActivity = newActivity;
        return notifyAllListeners(newActivity);
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
            return notifyAllListeners(lastActivity);
        }
    } else if (lastActivity.type !== "idle") {
        lastActivity = {
            type: "idle",
        };
        notifyAllListeners(lastActivity);
    }
}

function createNotification(obj: VideoRawObject) {
    const {
        title,
        thumbnail,
        channel: author,
        playing,
        duration,
    } = obj.elements;

    if (title && author && duration && playing) {
        const notificationObj: NotificationActivity = {
            type: "notification",
            info: {
                title,
                author,
                duration,
                thumbnail,
            },
        };
        if (!checkNotificationEquality(lastNotification, notificationObj)) {
            lastNotification = notificationObj;
            notifyAllListeners(notificationObj);
        }
    }
}

ipcMain.on("newContents", (_: IpcMainEvent, obj: VideoRawObject) => {
    createNotification(obj);
    onVideoRaw(obj);
});

ipcMain.on("timeChange", (_: IpcMainEvent, timeString: string) => {
    const activityObj = {
        timestamp: timeString,
    };
    lastActivity = { ...lastActivity, ...activityObj };
    notifyAllListeners(lastActivity);
});

export default observer;
