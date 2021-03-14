const { remote, ipcRenderer } = require("electron");

const webview = document.querySelector("webview");

const win = remote.getCurrentWindow();

const selectors = {
    title:
        "#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > yt-formatted-string",
    thumbnail:
        "#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > img",
    channel:
        "#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > span > span.subtitle.style-scope.ytmusic-player-bar > yt-formatted-string > a",
    search: "input#input",
    video: "#movie_player > div.html5-video-container > video",
};

function setClickEvent(elementId, callback) {
    const element = document.getElementById(elementId);
    element.addEventListener("click", callback);
    return {
        remove: () => {
            element.removeEventListener("click", callback);
        },
    };
}

function sendWebContent() {
    const url = webview.getURL();

    const title = webview.getTitle();

    webview
        .executeJavaScript(
            `
            (async () => {
                const elements = {
                    title: document.documentElement.querySelector("${selectors.title}")?.innerHTML,
                    thumbnail: document.documentElement.querySelector("${selectors.thumbnail}")?.getAttribute("src"),
                    channel: document.documentElement.querySelector("${selectors.channel}")?.innerHTML,
                    search: document.documentElement.querySelector("${selectors.search}")?.value,
                    playing: !document.documentElement.querySelector("${selectors.video}")?.paused,
                };
                return elements;
            })();`
        )
        .then((elements) => {
            const objectToSend = {
                url,
                title,
                elements,
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

// Window Controls
setClickEvent("minimizeButton", () => win.minimize());
setClickEvent("maximizeButton", () => win.maximize());
setClickEvent("closeButton", () => win.close());
