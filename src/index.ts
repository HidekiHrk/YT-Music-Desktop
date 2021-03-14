import { app } from "electron";
import MainWindow from "./mainWindow";
import Activity from "./activity";
import {
    setMusicActivity,
    setIdleActivity,
    setSearchActivity,
} from "./activity/presence";

let win: MainWindow;

app.on("ready", () => {
    win = new MainWindow();
    win.open();
    Activity.register(setMusicActivity);
    Activity.register(setIdleActivity);
    Activity.register(setSearchActivity);
});

app.setAsDefaultProtocolClient("hrkytmusic");

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
