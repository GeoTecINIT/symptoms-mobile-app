import {
    InternalEventManager,
    EventCallback,
    PlatformEvent
} from './internal-event-manager';

const internalEventManager = new InternalEventManager();

export function on(eventName: string, eventReceiver: EventCallback) {
    internalEventManager.on(eventName, eventReceiver);
}

export function off(eventName: string, eventReceiver: EventCallback) {
    internalEventManager.off(eventName, eventReceiver);
}

export function emit(platformEvent: PlatformEvent) {
    internalEventManager.emit(platformEvent);
}
