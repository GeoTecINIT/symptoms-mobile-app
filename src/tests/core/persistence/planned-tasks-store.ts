import { plannedTasksDB } from '~/app/core/persistence/planned-tasks-store';
import { PlannedTask } from '~/app/core/runners/task-planner/planned-task';
import { RunnableTask } from '~/app/core/runners/runnable-task';

describe('Planned Tasks Store', () => {
    const store = plannedTasksDB;

    const runnableTask1: RunnableTask = {
        name: 'dummyTask1',
        interval: 120000,
        recurrent: true,
        params: { param1: 'patata1' },
        cancelEvent: 'cancelEvent'
    };
    const runnableTask2: RunnableTask = {
        name: 'dummyTask2',
        interval: 60000,
        recurrent: true,
        params: { param1: 'patata1', param2: 'patata2' },
        cancelEvent: 'otherEvent'
    };
    const runnableTask3: RunnableTask = {
        name: 'dummyTask3',
        interval: 150000,
        recurrent: true,
        params: {},
        cancelEvent: 'cancelEvent'
    };

    const plannedTask1: PlannedTask = new PlannedTask('alarm', runnableTask1);
    const plannedTask2: PlannedTask = new PlannedTask('alarm', runnableTask2);
    const plannedTask3: PlannedTask = new PlannedTask('alarm', runnableTask3);

    beforeEach(async () => {
        await store.deleteAll();
        await store.insert(plannedTask1);
    });

    it('saves a planned task permanently', async () => {
        await store.insert(plannedTask2);
    });

    it('throws an error when trying to store an existing task', async () => {
        const { name, interval, recurrent } = runnableTask1;
        await expectAsync(store.insert(plannedTask1)).toBeRejectedWith(
            new Error(
                `Already stored: {name=${name}, interval=${interval}, recurrent=${recurrent}}`
            )
        );
    });

    it('deletes a stored task', async () => {
        await store.delete(plannedTask1.id);
        const task = await store.get(runnableTask1);
        expect(task).toBeNull();
    });

    it('gets a stored task by similarity criteria', async () => {
        const task = await store.get(runnableTask1);
        expect(task).toEqual(plannedTask1);
    });

    it('gets a stored task by id', async () => {
        const task = await store.get(plannedTask1.id);
        expect(task).toEqual(plannedTask1);
    });

    it('gets all stored task ordered by interval', async () => {
        await store.deleteAll();
        await store.insert(plannedTask1);
        await store.insert(plannedTask2);
        await store.insert(plannedTask3);

        const tasks = await store.getAllSortedByInterval('alarm');
        console.log(tasks);
        expect(tasks.length).toBe(3);
        for (let i = 0; i < tasks.length - 1; i++) {
            if (tasks[i].interval > tasks[i + 1].interval) {
                fail('Tasks out of order');
            }
        }
    });

    it('gets stored tasks with the same cancelEvent', async () => {
        await store.deleteAll();
        await store.insert(plannedTask1);
        await store.insert(plannedTask2);
        await store.insert(plannedTask3);

        const cancelEventTasks = await store.getAllFilteredByCancelEvent(
            'cancelEvent'
        );
        const otherEventTasks = await store.getAllFilteredByCancelEvent(
            'otherEvent'
        );
        expect(cancelEventTasks.length).toBe(2);
        expect(otherEventTasks.length).toBe(1);
    });

    it('increases error count of a task by id', async () => {
        await store.increaseErrorCount(plannedTask1.id);
        const task = await store.get(plannedTask1.id);
        expect(task.errorCount).toBe(plannedTask1.errorCount + 1);
    });

    it('increases timeout count of a task by id', async () => {
        await store.increaseTimeoutCount(plannedTask1.id);
        const task = await store.get(plannedTask1.id);
        expect(task.timeoutCount).toBe(plannedTask1.timeoutCount + 1);
    });

    it('updates last run of a task by id', async () => {
        const timestamp = 1000;
        await store.updateLastRun(plannedTask1.id, timestamp);
        const task = await store.get(plannedTask1.id);
        expect(task.lastRun).toBe(timestamp);
    });

    it('deletes all the stored tasks', async () => {
        await store.deleteAll();
        const tasks = await store.getAllSortedByInterval();
        expect(tasks.length).toBe(0);
    });

    afterAll(async () => {
        await store.deleteAll();
    });
});
