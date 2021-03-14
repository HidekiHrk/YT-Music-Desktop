declare type VideoRawObject = {
    url: string;
    title: string;
    elements: {
        title: string;
        thumbnail: string;
        channel: string;
        search: string;
        playing: boolean;
    };
};

declare type ActivityBase = {
    type: "video" | "search" | "idle";
};

declare type IdleActivity = ActivityBase & {
    customMessage?: string;
};

declare type SearchActivity = ActivityBase & {
    query: string;
};

declare type VideoActivity = ActivityBase & {
    title: string;
    channel: string;
    thumbnailUrl: string;
    playing: boolean;
    timestamp?: string;
};

declare type Activity = IdleActivity | SearchActivity | VideoActivity;

declare type Observer = {
    register: (
        callback: (activity: Activity) => void
    ) => { unregister: () => void };
    listeners: ((activity: Activity) => void)[];
};
