import { app } from "electron";
import MainWindow from "./mainWindow";
import Activity from "./activity";
import {
    setMusicActivity,
    setIdleActivity,
    setSearchActivity,
} from "./activity/presence";
import { notify } from "./notifications";

export let win: MainWindow;

function notifyListener(activity: NotificationActivity) {
    if (activity.type !== "notification") return;
    notify(activity.info);
}

app.on("ready", () => {
    win = new MainWindow();
    win.open();
    Activity.register(notifyListener);
    Activity.register(setMusicActivity);
    Activity.register(setIdleActivity);
    Activity.register(setSearchActivity);
});

app.setAsDefaultProtocolClient("hrkytmusic");

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
