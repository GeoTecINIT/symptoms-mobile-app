export interface PlatformEvent {
    name: string;
    id: string;
    data: { [key: string]: any };
}

export type EventCallback = (data: PlatformEvent) => void;

export interface EventReceiver {
    onReceive(platformEvent: PlatformEvent): void;
}
