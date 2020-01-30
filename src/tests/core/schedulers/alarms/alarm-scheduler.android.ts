import { AlarmManager } from '~/app/core/schedulers/alarms/alarm-manager.android';
import { AndroidAlarmScheduler } from '~/app/core/schedulers/alarms/alarm-scheduler.android';
import { PlannedTask } from '~/app/core/runners/task-planner/planned-task';
import { createScheduledTaskStoreMock } from '..';
import { RunnableTask } from '~/app/core/runners/runnable-task';

describe('Android Alarm Scheduler', () => {
    const manager = createAlarmManagerMock();
    const taskStore = createScheduledTaskStoreMock();
    const androidAlarm = new AndroidAlarmScheduler(manager, taskStore);

    const dummyTask: RunnableTask = {
        name: 'dummyTask',
        interval: 120000,
        recurrent: true,
        params: {}
    };
    const lowerFreqTask = {
        ...dummyTask,
        interval: dummyTask.interval * 2
    };
    const higherFreqTask = {
        ...dummyTask,
        interval: dummyTask.interval / 2
    };
    const equalFreqTask = {
        ...dummyTask,
        task: 'patata'
    };
    const expectedTask: PlannedTask = new PlannedTask('alarm', dummyTask);
    const lowerFreqST = new PlannedTask('alarm', lowerFreqTask);
    const higherFreqST = new PlannedTask('alarm', higherFreqTask);
    const equalFreqST = new PlannedTask('alarm', equalFreqTask);

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

    it('removes the highest frequency scheduled task and reschedules the alarm', async () => {
        spyOn(taskStore, 'get')
            .withArgs(higherFreqST.id)
            .and.returnValue(Promise.resolve(higherFreqST));
        spyOn(taskStore, 'getAllSortedByInterval').and.returnValue(
            Promise.resolve([higherFreqST, expectedTask])
        );

        await androidAlarm.cancel(higherFreqST.id);

        expect(manager.set).toHaveBeenCalledWith(expectedTask.interval);
        expect(taskStore.delete).toHaveBeenCalledWith(higherFreqST.id);
    });

    it('removes a task different than the one with the highest frequency', async () => {
        spyOn(taskStore, 'get')
            .withArgs(lowerFreqST.id)
            .and.returnValue(Promise.resolve(lowerFreqST));
        spyOn(taskStore, 'getAllSortedByInterval').and.returnValue(
            Promise.resolve([expectedTask, lowerFreqST])
        );

        await androidAlarm.cancel(lowerFreqST.id);

        expect(manager.cancel).not.toHaveBeenCalled();
        expect(manager.set).not.toHaveBeenCalled();
        expect(taskStore.delete).toHaveBeenCalledWith(lowerFreqST.id);
    });

    it('removes a task with the same frequency than the one with the highest frequency', async () => {
        spyOn(taskStore, 'get')
            .withArgs(equalFreqST.id)
            .and.returnValue(Promise.resolve(equalFreqST));
        spyOn(taskStore, 'getAllSortedByInterval').and.returnValue(
            Promise.resolve([equalFreqST, expectedTask])
        );

        await androidAlarm.cancel(equalFreqST.id);

        expect(manager.cancel).not.toHaveBeenCalled();
        expect(manager.set).not.toHaveBeenCalled();
        expect(taskStore.delete).toHaveBeenCalledWith(equalFreqST.id);
    });

    it('removes the only remaining task and cancels the alarm', async () => {
        spyOn(taskStore, 'get')
            .withArgs(expectedTask.id)
            .and.returnValue(Promise.resolve(expectedTask));
        spyOn(taskStore, 'getAllSortedByInterval').and.returnValue(
            Promise.resolve([expectedTask])
        );

        await androidAlarm.cancel(expectedTask.id);

        expect(manager.cancel).toHaveBeenCalled();
        expect(manager.set).not.toHaveBeenCalled();
        expect(taskStore.delete).toHaveBeenCalledWith(expectedTask.id);
    });

    it('will not remove a task not scheduled', async () => {
        spyOn(taskStore, 'get')
            .withArgs(expectedTask.id)
            .and.returnValue(Promise.resolve(null));

        await androidAlarm.cancel(expectedTask.id);

        expect(taskStore.delete).not.toHaveBeenCalled();
        expect(manager.cancel).not.toHaveBeenCalled();
        expect(taskStore.delete).not.toHaveBeenCalled();
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
