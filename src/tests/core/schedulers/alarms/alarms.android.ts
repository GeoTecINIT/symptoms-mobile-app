import {
    AlarmManager,
    AndroidAlarmScheduler
} from '~/app/core/schedulers/alarms/alarm-scheduler.android';
import { ScheduledTasksStore } from '~/app/core/schedulers/scheduled-tasks-store';
import {
    TaskToSchedule,
    ScheduledTask
} from '~/app/core/schedulers/scheduled-task';

describe('Android alarm', () => {
    const manager = createAlarmManagerMock();
    const taskStore = createScheduledTaskStoreMock();
    const androidAlarm = new AndroidAlarmScheduler(manager, taskStore);

    const dummyTask: TaskToSchedule = {
        task: 'dummyTask',
        interval: 120000,
        recurrent: true
    };
    const expectedTask: ScheduledTask = new ScheduledTask('alarm', dummyTask);
    const lowerFreqTask = {
        ...dummyTask,
        interval: dummyTask.interval * 2
    };
    const higherFreqTask = {
        ...dummyTask,
        interval: dummyTask.interval / 2
    };
    const lowerFreqST = new ScheduledTask('alarm', lowerFreqTask);
    const higherFreqST = new ScheduledTask('alarm', higherFreqTask);
    const equalFreqST = new ScheduledTask('alarm', {
        ...dummyTask,
        task: 'patata'
    });

    beforeEach(() => {
        spyOn(taskStore, 'insert').and.returnValue(Promise.resolve());
        spyOn(taskStore, 'delete').and.returnValue(Promise.resolve());
        spyOn(manager, 'set');
        spyOn(manager, 'cancel');
    });

    it('schedules a task and an alarm when no other task exists', async () => {
        spyOn(taskStore, 'get')
            .withArgs(dummyTask)
            .and.returnValue(Promise.resolve(null));
        spyOn(taskStore, 'getAllSortedByInterval').and.returnValue(
            Promise.resolve([])
        );

        const scheduledTask = await androidAlarm.schedule(dummyTask);

        expect(taskStore.get).toHaveBeenCalled();
        expect(taskStore.getAllSortedByInterval).toHaveBeenCalled();
        expect(manager.set).toHaveBeenCalled();
        expect(taskStore.insert).toHaveBeenCalled();
        expect(scheduledTask).not.toBeNull();
    });

    it('does nothing when a task has already been scheduled', async () => {
        spyOn(taskStore, 'get')
            .withArgs(dummyTask)
            .and.returnValue(Promise.resolve(expectedTask));
        const scheduledTask = await androidAlarm.schedule(dummyTask);
        expect(manager.set).not.toHaveBeenCalled();
        expect(scheduledTask).toBe(expectedTask);
    });

    it('schedules a task and reschedules an alarm when a lower frequency task exists', async () => {
        spyOn(taskStore, 'get')
            .withArgs(higherFreqTask)
            .and.returnValue(Promise.resolve(null));
        spyOn(taskStore, 'getAllSortedByInterval').and.returnValue(
            Promise.resolve([expectedTask])
        );

        const scheduledTask = await androidAlarm.schedule(higherFreqTask);

        expect(manager.cancel).toHaveBeenCalled();
        expect(manager.set).toHaveBeenCalledWith(higherFreqTask.interval);
        expect(taskStore.insert).toHaveBeenCalled();
        expect(scheduledTask).not.toBeNull();
    });

    it('schedules a task and does not reschedule an alarm when a higher frequency task exists', async () => {
        spyOn(taskStore, 'get')
            .withArgs(lowerFreqTask)
            .and.returnValue(Promise.resolve(null));
        spyOn(taskStore, 'getAllSortedByInterval').and.returnValue(
            Promise.resolve([expectedTask])
        );

        const scheduledTask = await androidAlarm.schedule(lowerFreqTask);

        expect(manager.cancel).not.toHaveBeenCalled();
        expect(manager.set).not.toHaveBeenCalled();
        expect(taskStore.insert).toHaveBeenCalled();
        expect(scheduledTask).not.toBeNull();
    });

    it('removes the highest frequency scheduled task and reschedules the alarm', () => {
        expect(taskStore.delete).toHaveBeenCalled();
        expect(manager.cancel).toHaveBeenCalled();
        expect(manager.set).toHaveBeenCalledWith();
    });

    it('removes a task different than the one with the highest frequency', () => {
        expect(taskStore.delete).toHaveBeenCalled();
        expect(manager.cancel).not.toHaveBeenCalled();
    });

    it('removes a task with the same frequency than the one with the highest frequency', () => {
        expect(taskStore.delete).toHaveBeenCalled();
        expect(manager.cancel).not.toHaveBeenCalled();
    });

    it('tries to remove a task not scheduled', async () => {
        spyOn(taskStore, 'get')
            .withArgs(dummyTask)
            .and.returnValue(Promise.resolve(null));

        await androidAlarm.cancel(expectedTask.id);

        expect(taskStore.delete).not.toHaveBeenCalled();
        expect(manager.cancel).not.toHaveBeenCalled();
    });
});

function createAlarmManagerMock(): AlarmManager {
    return {
        set(interval: number) {
            return null;
        },
        cancel() {
            return null;
        }
    };
}

function createScheduledTaskStoreMock(): ScheduledTasksStore {
    return {
        insert(scheduledTask: ScheduledTask) {
            return Promise.resolve();
        },
        delete(task: string) {
            return Promise.resolve();
        },
        get(task: TaskToSchedule | string) {
            return Promise.resolve(null);
        },
        getAllSortedByInterval() {
            return Promise.resolve([]);
        },
        increaseErrorCount(task: string) {
            return Promise.resolve();
        },
        increaseTimeoutCount(task: string) {
            return Promise.resolve();
        },
        updateLastRun(task: string, timestamp: number) {
            return Promise.resolve();
        }
    };
}
