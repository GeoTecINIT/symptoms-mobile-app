export interface PlatformEvent {
    name: string;
    id: string;
    data: { [key: string]: any };
}

export type EventCallback = (data: PlatformEvent) => void;

export interface EventReceiver {
    exec(platformEvent: PlatformEvent): void;
}
