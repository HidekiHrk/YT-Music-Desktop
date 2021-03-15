import NotificationWindow from ".";

export class NotificationQueue {
    items: NotificationInfo[];
    started: boolean;

    constructor() {
        this.items = [];
        this.started = false;
    }

    push(item: NotificationInfo) {
        this.items.push(item);
    }

    pull() {
        return this.items.splice(0, 1)[0];
    }

    async start() {
        if (this.started) return;
        this.started = true;
        let destroyed = true;
        const loopInterval = setInterval(() => {
            if (this.started) {
                if (this.items.length && destroyed) {
                    destroyed = false;
                    const newInfo = this.pull();
                    const win = NotificationWindow(newInfo);
                    const winTimeout = setTimeout(() => {
                        destroyed = true;
                        try {
                            win.close();
                        } catch (e) {}
                    }, 10000);
                    win.on("close", () => {
                        clearTimeout(winTimeout);
                        destroyed = true;
                    });
                }
            } else {
                clearInterval(loopInterval);
            }
        }, 1000);
    }

    stop() {
        this.started = false;
    }
}
