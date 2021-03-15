const { remote } = require("electron");

const win = remote.getCurrentWindow();

document.body.addEventListener("click", () => {
    win.close();
});
