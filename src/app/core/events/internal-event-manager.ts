import {
    Observable,
    fromObject,
    EventData as NSEventData
} from 'tns-core-modules/data/observable';

export interface PlatformEvent {
    name: string;
    id: string;
    data: { [key: string]: any };
}

export type EventCallback = (data: PlatformEvent) => void;

export class InternalEventManager {
    private notificationCenter: Observable;
    private callbacks: CallbackStore;

    constructor() {
        this.notificationCenter = fromObject({});
        this.callbacks = new CallbackStore();
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
        if (!internalCallback) {
            return;
        }
        this.notificationCenter.off(eventName, internalCallback);
        this.callbacks.delete(callbackId);
    }

    emit(platformEvent: PlatformEvent) {
        const internalEventData = {
            eventName: platformEvent.name,
            object: this.notificationCenter,
            data: { ...platformEvent }
        };
        this.notificationCenter.notify<InternalEventData>(internalEventData);
    }
}

type CallbackId = [string, EventCallback];

interface InternalEventData extends NSEventData {
    data: PlatformEvent;
}

type InternalEventCallback = (eventData: InternalEventData) => void;

// tslint:disable-next-line:max-classes-per-file
class CallbackStore {
    private callbackTree: Callbacks = {};

    set(callbackId: CallbackId, internalCallback: InternalEventCallback) {
        const [eventName, callback] = callbackId;
        if (!this.callbackTree[eventName]) {
            this.callbackTree[eventName] = new Map();
        }
        this.callbackTree[eventName].set(callback, internalCallback);
    }

    get(callbackId: CallbackId): InternalEventCallback {
        const [eventName, callback] = callbackId;
        const callbackMap = this.callbackTree[eventName];
        if (!callbackMap) {
            return null;
        }
        const internalCallback = callbackMap.get(callback) || null;

        return internalCallback ? internalCallback : null;
    }

    delete(callbackId: CallbackId) {
        const [eventName, callback] = callbackId;
        const callbackMap = this.callbackTree[eventName];
        if (!callbackMap) {
            return;
        }
        callbackMap.delete(callback);
        if (callbackMap.size === 0) {
            delete this.callbackTree[eventName];
        }
    }
}

interface Callbacks {
    [key: string]: Map<EventCallback, InternalEventCallback>;
}
