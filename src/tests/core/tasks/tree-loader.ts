import { Tasks } from '~/app/core/tasks';
import { SimpleTask } from '~/app/core/tasks/base/simple-task';
import {
    TaskTree,
    EventListenerCreator,
    DescribedTaskRunner
} from '~/app/core/tasks/tree';
import { Task } from '~/app/core/tasks/task';
import { TaskTreeLoader } from '~/app/core/tasks/tree/loader';
import { RunnableTaskBuilder } from '~/app/core/tasks/runnable-task';

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

    const taskTree: TaskTree = {
        async describe(on, run) {
            on('startEvent', run('acquireData').every(60));
            on('dataAcquired', run('printAcquiredData').now());

            on('startEvent', run('acquireOtherData').every(120));
        }
    };

    let eventListenerCreator: EventListenerCreator;
    let describedTaskRunner: DescribedTaskRunner;
    let taskProvider: (taskName: string) => Task;
    let treeLoader: TaskTreeLoader;

    beforeEach(() => {
        eventListenerCreator = jasmine.createSpy('eventListenerCreator');
        describedTaskRunner = jasmine
            .createSpy(
                'describedTaskRunner',
                (taskName: string) => new RunnableTaskBuilder(taskName, {})
            )
            .and.callThrough();
        taskProvider = jasmine
            .createSpy('taskProvider', (taskName: string) => tasks[taskName])
            .and.callThrough();
        treeLoader = new TaskTreeLoader(
            eventListenerCreator,
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
