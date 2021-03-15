import {
    app,
    BrowserWindow,
    BrowserWindowConstructorOptions,
    screen,
} from "electron";
import path from "path";
import { NotificationQueue } from "./queue";

const FILE_PATH = path.join(__dirname, "../../frontend/notifications.html");

const WINDOW_SETTINGS: BrowserWindowConstructorOptions = {
    width: 280,
    height: 110,
    resizable: false,
    skipTaskbar: true,
    show: false,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
    },
};

const queue = new NotificationQueue();
queue.start();

function getScreenSize(): Size {
    if (!app.isReady) return { width: NaN, height: NaN };
    const display = screen.getPrimaryDisplay();
    const { width, height } = display.bounds;
    return { width, height };
}

export default function NotificationWindow(info: NotificationInfo) {
    const screenSize = getScreenSize();
    const newProperties = {
        x: screenSize.width - WINDOW_SETTINGS.width,
        y: 0,
    };
    const nWindow = new BrowserWindow({ ...WINDOW_SETTINGS, ...newProperties });
    nWindow.loadFile(FILE_PATH);
    nWindow.on("ready-to-show", () => {
        nWindow.show();
        nWindow.webContents.on("did-finish-load", () => {
            let { title, author, duration, thumbnail } = info;
            title = title.replace(/"/g, '\\"');
            author = author.replace(/"/g, '\\"');

            nWindow.webContents.executeJavaScript(`
                document.documentElement.querySelector(".music").innerText = "${title}";
                document.documentElement.querySelector(".author").innerText = "${author}";
                document.documentElement.querySelector(".duration").innerText = "${duration}";
                document.documentElement.querySelector(".thumbnail").setAttribute("src", "${thumbnail}");
            `);
            if (title.length > 19) {
                nWindow.webContents.executeJavaScript(`
                    document.documentElement.querySelector(".music").className += " scrollable";
                `);
            }
            if (author.length > 19) {
                nWindow.webContents.executeJavaScript(`
                    document.documentElement.querySelector(".author").className += " scrollable";
                `);
            }
        });
    });
    return nWindow;
}

export function notify(info: NotificationInfo) {
    queue.push(info);
}
