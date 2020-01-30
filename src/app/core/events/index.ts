import { InternalEventManager } from './internal-event-manager';
import { PlatformEvent, EventCallback, EventReceiver } from './events';

const internalEventManager = new InternalEventManager();

export { PlatformEvent, EventCallback, EventReceiver } from './events';

export function on(
    eventName: string,
    eventReceiver: EventCallback | EventReceiver
) {
    if ('exec' in eventReceiver) {
        internalEventManager.on(eventName, eventReceiver.exec, eventReceiver);
    } else {
        internalEventManager.on(eventName, eventReceiver);
    }
}

export function off(
    eventName: string,
    eventReceiver?: EventCallback | EventReceiver
) {
    if (!eventReceiver) {
        internalEventManager.off(eventName);
    } else if ('exec' in eventReceiver) {
        internalEventManager.off(eventName, eventReceiver.exec, eventReceiver);
    } else {
        internalEventManager.off(eventName, eventReceiver);
    }
}

export function emit(platformEvent: PlatformEvent) {
    internalEventManager.emit(platformEvent);
}
