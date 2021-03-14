import { App, BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import path from "path";

const FILE_PATH = path.join(__dirname, "../frontend/index.html");

const ICON_PATH = path.join(__dirname, "../frontend/img/icon.png");

const WINDOW_SETTINGS: BrowserWindowConstructorOptions = {
    width: 840,
    height: 520,
    minWidth: 840,
    minHeight: 520,
    center: true,
    resizable: true,
    icon: ICON_PATH,
    frame: false,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webviewTag: true,
        enableRemoteModule: true,
    },
};

class MainWindow extends BrowserWindow {
    constructor() {
        super(WINDOW_SETTINGS);
    }

    open() {
        this.loadFile(FILE_PATH);
        this.webContents.userAgent =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0";
        // this.webContents.openDevTools({ mode: "undocked" });
        this.on("ready-to-show", () => {
            this.show();
        });
    }
}

export default MainWindow;
