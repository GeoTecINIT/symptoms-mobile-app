import { InternalEventManager } from './internal-event-manager';
import { PlatformEvent, EventCallback, EventReceiver } from './events';

const internalEventManager = new InternalEventManager();

export { PlatformEvent, EventCallback, EventReceiver } from './events';

export function on(
    eventName: string,
    eventReceiver: EventCallback | EventReceiver
): number {
    let receiver = eventReceiver as EventCallback;
    if ('onReceive' in eventReceiver) {
        receiver = (event) => eventReceiver.onReceive(event);
    }

    return internalEventManager.on(eventName, receiver);
}

export function off(eventName: string, listenerId?: number) {
    if (!listenerId) {
        internalEventManager.off(eventName);
    } else {
        internalEventManager.off(eventName, listenerId);
    }
}

export function emit(platformEvent: PlatformEvent) {
    internalEventManager.emit(platformEvent);
}
