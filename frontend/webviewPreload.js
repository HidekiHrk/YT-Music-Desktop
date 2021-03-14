const { ipcRenderer } = require("electron");

let currentVideoTime = "";

function sendChangedTime() {
    const element = document.querySelector("#left-controls > span");
    const timeString = element?.innerText;
    if (timeString && currentVideoTime === timeString) return;
    currentVideoTime = timeString;
    ipcRenderer.sendToHost("timeChange", timeString);
}

setInterval(sendChangedTime, 1000);
