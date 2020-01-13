import {
    scheduleAlarm,
    AlarmScheduler,
    ScheduledTaskStore,
    setAlarmScheduler,
    setScheduledTaskStore
} from '~/app/core/schedulers/alarms/alarm-scheduler.android';
import { TaskToSchedule, ScheduledTask } from '~/app/core/schedulers';

describe('Android alarm', () => {
    const dummyTask = { name: 'dummyTask', in: 60000, recurrent: true };
    const scheduler: AlarmScheduler = {
        set(interval: number) {
            return null;
        },
        cancel() {
            return null;
        }
    };
    const taskStore: ScheduledTaskStore = {
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

    setAlarmScheduler(scheduler);
    setScheduledTaskStore(taskStore);

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
        throw new Error('Not implemented');
    });

    it('schedules a task and reschedules an alarm when a lower frequency task exists', () => {
        throw new Error('Not implemented');
    });

    it('schedules a task when a higher frequency task exists', () => {
        throw new Error('Not implemented');
    });
});
