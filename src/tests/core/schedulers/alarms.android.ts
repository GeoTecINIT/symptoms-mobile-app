import {
    scheduleAlarm,
    AlarmScheduler,
    ScheduledTaskStore,
    setAlarmScheduler,
    setScheduledTaskStore
} from '~/app/core/schedulers/alarms/alarm-scheduler.android';
import { TaskToSchedule, ScheduledTask } from '~/app/core/schedulers';

describe('Android alarm', () => {
    const scheduler = createAlarmSchedulerMock();
    const taskStore = createScheduledTaskStoreMock();
    setAlarmScheduler(scheduler);
    setScheduledTaskStore(taskStore);

    const dummyTask = { task: 'dummyTask', in: 120000, recurrent: true };
    const expectedTask = new ScheduledTask('alarm', dummyTask);

    it('schedules a task and an alarm when no other task exists', () => {
        spyOn(taskStore, 'get')
            .withArgs(dummyTask)
            .and.returnValue(null);
        spyOn(taskStore, 'getAll').and.returnValue([]);
        spyOn(scheduler, 'set').withArgs(dummyTask.in);
        spyOn(taskStore, 'insert');

        const scheduledTask = scheduleAlarm(dummyTask);

        expect(taskStore.get).toHaveBeenCalled();
        expect(taskStore.getAll).toHaveBeenCalled();
        expect(scheduler.set).toHaveBeenCalled();
        expect(taskStore.insert).toHaveBeenCalled();
        expect(scheduledTask).not.toBeNull();
    });

    it('does nothing when a task has already been scheduled', () => {
        spyOn(taskStore, 'get')
            .withArgs(dummyTask)
            .and.returnValue(expectedTask);
        spyOn(scheduler, 'set');
        const scheduledTask = scheduleAlarm(dummyTask);
        expect(scheduler.set).not.toHaveBeenCalled();
        expect(scheduledTask).toBe(expectedTask);
    });

    it('schedules a task and reschedules an alarm when a lower frequency task exists', () => {
        const higherFreqTask = { ...dummyTask, in: dummyTask.in / 2 };
        spyOn(taskStore, 'get')
            .withArgs(higherFreqTask)
            .and.returnValue(null);
        spyOn(taskStore, 'getAll').and.returnValue([expectedTask]);
        spyOn(scheduler, 'cancel');
        spyOn(scheduler, 'set').withArgs(higherFreqTask.in);
        spyOn(taskStore, 'insert');

        const scheduledTask = scheduleAlarm(higherFreqTask);

        expect(scheduler.cancel).toHaveBeenCalled();
        expect(scheduler.set).toHaveBeenCalledWith(higherFreqTask.in);
        expect(taskStore.insert).toHaveBeenCalled();
        expect(scheduledTask).not.toBeNull();
    });

    it('schedules a task and does not reschedule an alarm when a higher frequency task exists', () => {
        const lowerFreqTask = { ...dummyTask, in: dummyTask.in * 2 };
        spyOn(taskStore, 'get')
            .withArgs(lowerFreqTask)
            .and.returnValue(null);
        spyOn(taskStore, 'getAll').and.returnValue([expectedTask]);
        spyOn(scheduler, 'cancel');
        spyOn(scheduler, 'set');
        spyOn(taskStore, 'insert');

        const scheduledTask = scheduleAlarm(lowerFreqTask);

        expect(scheduler.cancel).not.toHaveBeenCalled();
        expect(scheduler.set).not.toHaveBeenCalled();
        expect(taskStore.insert).toHaveBeenCalled();
        expect(scheduledTask).not.toBeNull();
    });
});

function createAlarmSchedulerMock(): AlarmScheduler {
    return {
        set(interval: number) {
            return null;
        },
        cancel() {
            return null;
        }
    };
}

function createScheduledTaskStoreMock(): ScheduledTaskStore {
    return {
        insert(scheduledTask: ScheduledTask) {
            return null;
        },
        delete(task: string) {
            return null;
        },
        get(task: TaskToSchedule | string) {
            return null;
        },
        getAll(): Array<ScheduledTask> {
            return [];
        },
        increaseErrorCount(task: string) {
            return null;
        },
        increaseTimeoutCount(task: string) {
            return null;
        },
        updateLastRun(task: string, timestamp: number) {
            return null;
        }
    };
}
