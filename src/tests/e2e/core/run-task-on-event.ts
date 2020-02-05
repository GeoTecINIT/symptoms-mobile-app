import { setTasks } from '~/app/core/tasks/provider';
import { testTasks } from '~/tests/core/tasks';
import { on, emit, off, PlatformEvent, EventCallback } from '~/app/core/events';
import { run } from '~/app/core/tasks';
import { uuid } from '~/app/core/utils/uuid';

describe('Event-based task runner', () => {
    setTasks(testTasks);

    let eventCallback: EventCallback;
    const startEvent: PlatformEvent = {
        name: 'startEvent',
        id: uuid(),
        data: {}
    };

    const stopEvent: PlatformEvent = {
        name: 'stopEvent',
        id: uuid(),
        data: {}
    };
    const expectedEvent: PlatformEvent = {
        name: 'patataCooked',
        id: startEvent.id,
        data: { status: 'slightlyBaked' }
    };

    beforeEach(() => {
        eventCallback = jasmine.createSpy('eventCallback');
    });

    it('runs a task at the moment an event rises', async () => {
        on(
            'startEvent',
            run('emitterTask')
                .now()
                .cancelOn('stopEvent')
        );
        const callbackPromise = new Promise((resolve) => {
            on(expectedEvent.name, (evt) => {
                eventCallback(evt);
                resolve();
            });
        });

        emit(startEvent);
        await callbackPromise;

        expect(eventCallback).toHaveBeenCalledWith(expectedEvent);
    });

    it('does not run a task if it has been stopped', async () => {
        on(
            'startEvent',
            run('emitterTask')
                .now()
                .cancelOn('stopEvent')
        );
        const callbackPromise = new Promise((resolve, reject) => {
            setTimeout(() => resolve(), 2000);
            on(expectedEvent.name, (evt) => {
                eventCallback(evt);
                reject(new Error('Callback should not be called'));
            });
        });

        emit(stopEvent);
        emit(startEvent);
        await callbackPromise;

        expect(eventCallback).not.toHaveBeenCalled();
    });

    afterEach(() => {
        off(startEvent.name);
        off(stopEvent.name);
        off(expectedEvent.name);
    });
});
