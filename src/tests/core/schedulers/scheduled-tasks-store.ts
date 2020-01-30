import { scheduledTasksDB } from '~/app/core/schedulers/scheduled-tasks-store';
import { ScheduledTask } from '~/app/core/schedulers/scheduled-task';
import { RunnableTask } from '~/app/core/runners/runnable-task';

describe('Scheduled Tasks Store', () => {
    const store = scheduledTasksDB;

    const runnableTask1: RunnableTask = {
        name: 'dummyTask1',
        interval: 120000,
        recurrent: true,
        params: {}
    };
    const runnableTask2: RunnableTask = {
        name: 'dummyTask2',
        interval: 60000,
        recurrent: true,
        params: {}
    };
    const runnableTask3: RunnableTask = {
        name: 'dummyTask3',
        interval: 150000,
        recurrent: true,
        params: {}
    };

    const scheduledTask1: ScheduledTask = new ScheduledTask(
        'alarm',
        runnableTask1
    );
    const scheduledTask2: ScheduledTask = new ScheduledTask(
        'alarm',
        runnableTask2
    );
    const scheduledTask3: ScheduledTask = new ScheduledTask(
        'alarm',
        runnableTask3
    );

    beforeEach(async () => {
        await store.deleteAll();
        await store.insert(scheduledTask1);
    });

    it('saves a scheduled task permanently', async () => {
        await store.insert(scheduledTask2);
    });

    it('throws an error when trying to store an existing task', async () => {
        const { name, interval, recurrent } = runnableTask1;
        await expectAsync(store.insert(scheduledTask1)).toBeRejectedWith(
            new Error(
                `Already stored: {name=${name}, interval=${interval}, recurrent=${recurrent}}`
            )
        );
    });

    it('deletes a stored task', async () => {
        await store.delete(scheduledTask1.id);
        const task = await store.get(runnableTask1);
        expect(task).toBeNull();
    });

    it('gets a stored task by similarity criteria', async () => {
        const task = await store.get(runnableTask1);
        expect(task).toEqual(scheduledTask1);
    });

    it('gets a stored task by id', async () => {
        const task = await store.get(scheduledTask1.id);
        expect(task).toEqual(scheduledTask1);
    });

    it('gets all stored task ordered by interval', async () => {
        await store.deleteAll();
        await store.insert(scheduledTask1);
        await store.insert(scheduledTask2);
        await store.insert(scheduledTask3);

        const tasks = await store.getAllSortedByInterval('alarm');
        expect(tasks.length).toBe(3);
        for (let i = 0; i < tasks.length - 1; i++) {
            if (tasks[i].interval > tasks[i + 1].interval) {
                fail('Tasks out of order');
            }
        }
    });

    it('increases error count of a task by id', async () => {
        await store.increaseErrorCount(scheduledTask1.id);
        const task = await store.get(scheduledTask1.id);
        expect(task.errorCount).toBe(scheduledTask1.errorCount + 1);
    });

    it('increases timeout count of a task by id', async () => {
        await store.increaseTimeoutCount(scheduledTask1.id);
        const task = await store.get(scheduledTask1.id);
        expect(task.timeoutCount).toBe(scheduledTask1.timeoutCount + 1);
    });

    it('updates last run of a task by id', async () => {
        const timestamp = 1000;
        await store.updateLastRun(scheduledTask1.id, timestamp);
        const task = await store.get(scheduledTask1.id);
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
