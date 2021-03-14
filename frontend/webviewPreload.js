const { ipcRenderer } = require("electron");

var currentVideoTime = "";

function sendChangedTime() {
    const element = document.querySelector("#left-controls > span");
    if (!element) return;
    const timeString = element.innerText;
    if (currentVideoTime === timeString) return;
    currentVideoTime = timeString;
    ipcRenderer.sendToHost("timeChange", timeString);
}

setInterval(sendChangedTime, 1000);
