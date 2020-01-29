import {
    InternalEventManager,
    EventData,
    EventCallback
} from '~/app/core/events/internal-event-manager';

describe('Internal event manager', () => {
    const eventName = 'dummyEvent';
    const eventData = { param: 'patata' };
    const expectedEventData = { ...eventData, eventName };
    let dummyCallback: EventCallback;
    let anotherDummyCallback: EventCallback;
    let internalEventManager: InternalEventManager;

    beforeEach(() => {
        internalEventManager = new InternalEventManager();
        dummyCallback = jasmine.createSpy('dummyCallback');
        anotherDummyCallback = jasmine.createSpy('anotherDummyCallback');
    });

    it('allows to register an event subscription', () => {
        internalEventManager.on(eventName, dummyCallback);
        internalEventManager.emmit(eventName, eventData);
        expect(dummyCallback).toHaveBeenCalledWith(expectedEventData);
    });

    it('allows to unregister an event subscription', () => {
        internalEventManager.on(eventName, dummyCallback);
        internalEventManager.off(eventName, dummyCallback);
        internalEventManager.emmit(eventName, eventData);
        expect(dummyCallback).not.toHaveBeenCalled();
    });

    it('allows to register multiple event subscriptions', () => {
        internalEventManager.on(eventName, dummyCallback);
        internalEventManager.on(eventName, anotherDummyCallback);
        internalEventManager.emmit(eventName, eventData);
        expect(dummyCallback).toHaveBeenCalledWith(expectedEventData);
        expect(anotherDummyCallback).toHaveBeenCalledWith(expectedEventData);
    });

    it('allows to unregister one of the event subscriptions', () => {
        internalEventManager.on(eventName, dummyCallback);
        internalEventManager.on(eventName, anotherDummyCallback);
        internalEventManager.off(eventName, dummyCallback);
        internalEventManager.emmit(eventName, eventData);
        expect(dummyCallback).not.toHaveBeenCalled();
        expect(anotherDummyCallback).toHaveBeenCalledWith(expectedEventData);
    });
});
