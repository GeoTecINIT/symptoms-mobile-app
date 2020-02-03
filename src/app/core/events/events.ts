import { uuid } from '../utils/uuid';

export enum CoreEvent {
    TaskExecutionTimedOut = 'taskExecutionTimedOut'
}

export interface PlatformEvent {
    name: string;
    id: string;
    data: EventData;
}

interface EventData {
    [key: string]: any;
}

export type EventCallback = (data: PlatformEvent) => void;

export interface EventReceiver {
    onReceive(platformEvent: PlatformEvent): void;
}

export function createEvent(name: string, data: EventData = {}): PlatformEvent {
    return {
        name,
        id: uuid(),
        data
    };
}
