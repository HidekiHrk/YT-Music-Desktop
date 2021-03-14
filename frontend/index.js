const { remote, ipcRenderer } = require("electron");

const webview = document.querySelector("webview");

const win = remote.getCurrentWindow();

function setClickEvent(elementId, callback) {
    const element = document.getElementById(elementId);
    element.addEventListener("click", callback);
    return {
        remove: () => {
            element.removeEventListener("click", callback);
        },
    };
}

setClickEvent("minimizeButton", () => win.minimize());
setClickEvent("maximizeButton", () => win.maximize());
setClickEvent("closeButton", () => win.close());

function sendWebContent() {
    const url = webview.getURL();

    const title = webview.getTitle();

    webview
        .executeJavaScript(
            `(async () => {
                return document.documentElement.innerHTML;
            })();`
        )
        .then((html) => {
            const objectToSend = {
                url,
                title,
                html,
            };
            ipcRenderer.send("newContents", objectToSend);
        });
}

webview.addEventListener("ipc-message", (event) => {
    if (event.channel === "timeChange") {
        ipcRenderer.send("timeChange", ...event.args);
    }
});

webview.addEventListener("page-title-updated", () => {
    setTimeout(sendWebContent, 500);
});

webview.addEventListener("did-stop-loading", sendWebContent);
