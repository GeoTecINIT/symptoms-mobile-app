import { InternalEventManager } from '~/app/core/events/internal-event-manager';
import { EventCallback } from '~/app/core/events';

describe('Internal event manager', () => {
    const eventName = 'dummyEvent';
    const platformEvent = {
        name: eventName,
        id: 'uniqueEventId',
        data: { param: 'patata' }
    };
    let internalEventManager: InternalEventManager;
    let dummyCallback: EventCallback;
    let anotherDummyCallback: EventCallback;

    beforeEach(() => {
        internalEventManager = new InternalEventManager();
        dummyCallback = jasmine.createSpy('dummyCallback');
        anotherDummyCallback = jasmine.createSpy('anotherDummyCallback');
    });

    afterEach(() => {
        internalEventManager.off(eventName);
    });

    it('allows to register an event subscription', () => {
        const listenerId = internalEventManager.on(eventName, dummyCallback);
        internalEventManager.emit(platformEvent);
        expect(dummyCallback).toHaveBeenCalledWith(platformEvent);
        expect(listenerId).toEqual(jasmine.any(Number));
    });

    it('allows to unregister an event subscription', () => {
        const listenerId = internalEventManager.on(eventName, dummyCallback);
        internalEventManager.off(eventName, listenerId);
        internalEventManager.emit(platformEvent);
        expect(dummyCallback).not.toHaveBeenCalled();
    });

    it('allows to register multiple event subscriptions', () => {
        internalEventManager.on(eventName, dummyCallback);
        internalEventManager.on(eventName, anotherDummyCallback);
        internalEventManager.emit(platformEvent);
        expect(dummyCallback).toHaveBeenCalledWith(platformEvent);
        expect(anotherDummyCallback).toHaveBeenCalledWith(platformEvent);
    });

    it('allows to unregister one of the event subscriptions', () => {
        const listenerId = internalEventManager.on(eventName, dummyCallback);
        internalEventManager.on(eventName, anotherDummyCallback);
        internalEventManager.off(eventName, listenerId);
        internalEventManager.emit(platformEvent);
        expect(dummyCallback).not.toHaveBeenCalled();
        expect(anotherDummyCallback).toHaveBeenCalledWith(platformEvent);
    });
});
