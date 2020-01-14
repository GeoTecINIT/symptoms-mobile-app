import { ScheduledTasksDBStore } from '~/app/core/schedulers/scheduled-tasks-store';
import { TaskToSchedule, ScheduledTask } from '~/app/core/schedulers';

describe('Scheduled Tasks Store', () => {

    const store = new ScheduledTasksDBStore();

    const taskToSchedule1: TaskToSchedule = { task: 'dummyTask1', interval: 120000, recurrent: true };
    const taskToSchedule2: TaskToSchedule = { task: 'dummyTask2', interval: 60000, recurrent: true };
    const taskToSchedule3: TaskToSchedule = { task: 'dummyTask3', interval: 150000, recurrent: true };

    const scheduledTask1: ScheduledTask = new ScheduledTask('alarm', taskToSchedule1);
    const scheduledTask2: ScheduledTask = new ScheduledTask('alarm', taskToSchedule2);
    const scheduledTask3: ScheduledTask = new ScheduledTask('alarm', taskToSchedule3);
    
    beforeEach(() => { store.deleteAll(); store.insert(scheduledTask1); });

    it('saves a scheduled task permanently', () => {
        store.insert(scheduledTask2);
    });

    it('throws an error when trying to store an existing task', () => {
        expect(() => { store.insert(scheduledTask1); }).toThrow(new Error(`Already stored: ${taskToSchedule1}`));
    });

    it('deletes a stored task', () => {
        store.delete(scheduledTask1.id);
        store.insert(scheduledTask1);
    });

    it('gets a stored task by similarity criteria', () => {
        const task = store.get(taskToSchedule1);
        expect(task).toEqual(scheduledTask1);
    });

    it('gets a stored task by id', () => {
        const task = store.get(scheduledTask1.id);
        expect(task).toEqual(scheduledTask1);
    });

    it('gets all stored task ordered by interval', () => {
        store.deleteAll();
        store.insert(scheduledTask1);
        store.insert(scheduledTask2);
        store.insert(scheduledTask3);

        const tasks = store.getAllSortedByInterval();

        for (let i = 0; i < tasks.length - 1; i++) {
            if (tasks[i].interval > tasks[i + 1].interval) {
                fail('Tasks out of order');
            }
        }
    });

    it('increses error count of a task by id', () => {
        store.increaseErrorCount(scheduledTask1.id);
        const task = store.get(scheduledTask1.id);
        expect(task.errorCount).toBe(scheduledTask1.errorCount + 1);
    });

    it('increses timeout count of a task by id', () => {
        store.increaseTimeoutCount(scheduledTask1.id);
        const task = store.get(scheduledTask1.id);
        expect(task.timeoutCount).toBe(scheduledTask1.timeoutCount + 1);
    });

    it('updates last run of a task by id', () => {
        const timestamp = 1000;
        store.updateLastRun(scheduledTask1.id, timestamp);
        const task = store.get(scheduledTask1.id);
        expect(task.lastRun).toBe(timestamp);
    });

    afterAll(() => { store.deleteAll(); });
});
