import { Tasks } from '~/app/core/tasks';
import { SimpleTask } from '~/app/core/tasks/base/simple-task';
import { TaskGraph, RunnableTaskDescriptor } from '~/app/core/tasks/graph';
import { Task } from '~/app/core/tasks/task';
import { TaskGraphLoader } from '~/app/core/tasks/graph/loader';
import {
    RunnableTaskBuilder,
    ReadyRunnableTaskBuilder
} from '~/app/core/tasks/runnable-task';
import { CoreEvent, emit, createEvent } from '~/app/core/events';

describe('Task tree loader', () => {
    const errorMsg = 'Task is not ready';

    const acquireData = new SimpleTask('acquireData', async () => null);
    const printAcquiredData = new SimpleTask(
        'printAcquiredData',
        async () => null
    );
    const acquireOtherData = new SimpleTask(
        'acquireOtherData',
        async () => null
    );

    const tasks: Tasks = {
        acquireData,
        printAcquiredData,
        acquireOtherData
    };

    const listenerIds = {
        acquireData: 0,
        printAcquiredData: 1,
        acquireOtherData: 2
    };

    const taskTree: TaskGraph = {
        async describe(on, run) {
            on(
                'startEvent',
                run('acquireData')
                    .every(60)
                    .cancelOn('endEvent')
            );
            on('dataAcquired', run('printAcquiredData'));

            on(
                'startEvent',
                run('acquireOtherData')
                    .every(120)
                    .cancelOn('endEvent')
            );
        }
    };

    let eventListenerCreator: (
        eventName: string,
        taskBuilder: ReadyRunnableTaskBuilder
    ) => number;
    let eventListenerDestroyer: (eventName: string, listenerId: number) => void;
    let describedTaskRunner: RunnableTaskDescriptor;
    let taskProvider: (taskName: string) => Task;
    let treeLoader: TaskGraphLoader;

    beforeEach(() => {
        eventListenerCreator = jasmine
            .createSpy(
                'eventListenerCreator',
                (eventName: string, taskBuilder: ReadyRunnableTaskBuilder) =>
                    listenerIds[taskBuilder.build().name]
            )
            .and.callThrough();
        eventListenerDestroyer = jasmine.createSpy('eventListenerDestroyer');
        describedTaskRunner = jasmine
            .createSpy(
                'describedTaskRunner',
                (taskName: string) => new RunnableTaskBuilder(taskName, {})
            )
            .and.callThrough();
        taskProvider = jasmine
            .createSpy('taskProvider', (taskName: string) => tasks[taskName])
            .and.callThrough();
        treeLoader = new TaskGraphLoader(
            eventListenerCreator,
            eventListenerDestroyer,
            describedTaskRunner,
            (_: string) => null,
            taskProvider
        );
        spyOn(acquireData, 'prepare').and.returnValue(Promise.resolve());
        spyOn(acquireOtherData, 'prepare').and.returnValue(Promise.resolve());
    });

    it('loads a task tree without errors', async () => {
        await treeLoader.load(taskTree);
        expect(eventListenerCreator).toHaveBeenCalledWith(
            'startEvent',
            jasmine.any(RunnableTaskBuilder)
        );
        expect(eventListenerCreator).toHaveBeenCalledWith(
            'dataAcquired',
            jasmine.any(RunnableTaskBuilder)
        );
        expect(describedTaskRunner).toHaveBeenCalledWith('acquireData');
        expect(describedTaskRunner).toHaveBeenCalledWith('printAcquiredData');
    });

    it('unbinds tasks from its start event when cancel event gets emitted', async () => {
        await treeLoader.load(taskTree);
        emit(createEvent('endEvent'));
        expect(eventListenerDestroyer).toHaveBeenCalledWith(
            'startEvent',
            listenerIds.acquireData
        );
        expect(eventListenerDestroyer).toHaveBeenCalledWith(
            'startEvent',
            listenerIds.acquireOtherData
        );
    });

    it('unbinds tasks from its start event when default cancel event gets emitted', async () => {
        await treeLoader.load(taskTree);
        emit(createEvent(CoreEvent.DefaultCancelEvent));
        expect(eventListenerDestroyer).toHaveBeenCalledWith(
            'dataAcquired',
            listenerIds.printAcquiredData
        );
    });

    it('returns that is not ready when at least one task is not', async () => {
        spyOn(acquireData, 'checkIfCanRun').and.throwError(errorMsg);
        spyOn(acquireOtherData, 'checkIfCanRun').and.returnValue(
            Promise.resolve()
        );
        await treeLoader.load(taskTree);
        const isReady = await treeLoader.isReady();
        expect(isReady).toBeFalsy();
    });

    it('returns that is ready when all tasks are', async () => {
        spyOn(acquireData, 'checkIfCanRun').and.returnValue(Promise.resolve());
        spyOn(acquireOtherData, 'checkIfCanRun').and.returnValue(
            Promise.resolve()
        );
        await treeLoader.load(taskTree);
        const isReady = await treeLoader.isReady();
        expect(isReady).toBeTruthy();
    });

    it('prepares a loaded task tree if needed', async () => {
        spyOn(acquireData, 'checkIfCanRun').and.throwError(errorMsg);
        spyOn(acquireOtherData, 'checkIfCanRun').and.throwError(errorMsg);
        await treeLoader.load(taskTree);
        await treeLoader.prepare();
        expect(acquireData.prepare).toHaveBeenCalled();
        expect(acquireOtherData.prepare).toHaveBeenCalled();
    });

    it('does nothing when task tree is ready', async () => {
        spyOn(acquireData, 'checkIfCanRun').and.returnValue(Promise.resolve());
        spyOn(acquireOtherData, 'checkIfCanRun').and.returnValue(
            Promise.resolve()
        );
        await treeLoader.load(taskTree);
        await treeLoader.prepare();
        expect(acquireData.prepare).not.toHaveBeenCalled();
        expect(acquireOtherData.prepare).not.toHaveBeenCalled();
    });
});
