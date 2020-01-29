import {
    Observable,
    fromObject,
    EventData as NSEventData
} from 'tns-core-modules/data/observable';

export type EventCallback = (data: EventData) => void;
type CallbackId = [string, EventCallback];
type InternalEventCallback = (eventData: InternalEventData) => void;

export class InternalEventManager {
    private notificationCenter: Observable;
    private callbacks: WeakMap<CallbackId, InternalEventCallback>;

    constructor() {
        this.notificationCenter = fromObject({});
        this.callbacks = new WeakMap();
    }

    on(eventName: string, callback: EventCallback) {
        const callbackId: CallbackId = [eventName, callback];
        const internalCallback = (eventData: InternalEventData) =>
            callback(eventData.data);
        this.callbacks.set(callbackId, internalCallback);
        this.notificationCenter.on(eventName, internalCallback);
    }

    off(eventName: string, callback: EventCallback) {
        const callbackId: CallbackId = [eventName, callback];
        const internalCallback = this.callbacks.get(callbackId);
        this.notificationCenter.off(eventName, internalCallback);
        this.callbacks.delete(callbackId);
    }

    emmit(eventName: string, eventData: EventData) {
        const internalEventData = {
            eventName,
            object: this.notificationCenter,
            data: { ...eventData, eventName }
        };
        this.notificationCenter.notify<InternalEventData>(internalEventData);
    }
}

interface InternalEventData extends NSEventData {
    data: EventData;
}

export interface EventData {
    eventName?: string;
    [key: string]: any;
}
