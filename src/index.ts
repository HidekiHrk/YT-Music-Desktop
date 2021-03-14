import { app } from "electron";
import MainWindow from "./mainWindow";
import Activity from "./activity";
import { setMusicActivity } from "./activity/presence";

let win: MainWindow;

app.on("ready", () => {
    win = new MainWindow();
    win.open();
    Activity.register(setMusicActivity);
});

app.setAsDefaultProtocolClient("hrkytmusic");

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
