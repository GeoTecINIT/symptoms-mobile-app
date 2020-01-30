import { setTasks } from '~/app/core/tasks/task-provider';
import { testTasks } from '~/tests/core/tasks';
import { on, emit, off, PlatformEvent, EventCallback } from '~/app/core/events';
import { run } from '~/app/core/runners';
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

    it('runs a task at the moment an event rises', () => {
        on(
            'startEvent',
            run('emitterTask')
                .now()
                .cancelOn('stopEvent')
        );

        on(expectedEvent.name, eventCallback);
        emit(startEvent);
        expect(eventCallback).toHaveBeenCalledWith(expectedEvent);
    });

    it('does not run a task if it has been stopped', () => {
        on(
            'startEvent',
            run('emitterTask')
                .now()
                .cancelOn('stopEvent')
        );

        on(expectedEvent.name, eventCallback);
        emit(stopEvent);
        emit(startEvent);
        expect(eventCallback).not.toHaveBeenCalled();
    });

    afterEach(() => {
        off(startEvent.name);
        off(stopEvent.name);
        off(expectedEvent.name);
    });
});
