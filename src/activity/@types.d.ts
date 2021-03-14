declare type VideoRawObject = {
    url: string;
    title: string;
    html: string;
};

declare type Activity = {
    title: string;
    channel: string;
    thumbnailUrl: string;
    timestamp?: string;
};

declare type Observer = {
    register: (
        callback: (activity: Activity) => void
    ) => { unregister: () => void };
    listeners: ((activity: Activity) => void)[];
};
