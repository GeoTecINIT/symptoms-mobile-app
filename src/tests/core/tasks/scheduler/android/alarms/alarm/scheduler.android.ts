import { AlarmManager } from '~/app/core/tasks/scheduler/android/alarms/abstract-alarm-manager.android';
import { AndroidAlarmScheduler } from '~/app/core/tasks/scheduler/android/alarms/alarm/scheduler.android';
import {
    PlannedTask,
    PlanningType
} from '~/app/core/tasks/planner/planned-task';
import { createPlannedTaskStoreMock } from '../../../../../persistence';
import { RunnableTask } from '~/app/core/tasks/runnable-task';

describe('Android Alarm Scheduler', () => {
    const manager = createAlarmManagerMock();
    const watchdog = createAlarmManagerMock();
    const taskStore = createPlannedTaskStoreMock();
    const androidAlarm = new AndroidAlarmScheduler(
        manager,
        watchdog,
        taskStore
    );

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
    const expectedTask: PlannedTask = new PlannedTask(
        PlanningType.Alarm,
        dummyTask
    );
    const lowerFreqPT = new PlannedTask(PlanningType.Alarm, lowerFreqTask);
    const higherFreqPT = new PlannedTask(PlanningType.Alarm, higherFreqTask);
    const equalFreqPT = new PlannedTask(PlanningType.Alarm, equalFreqTask);

    beforeEach(() => {
        spyOn(taskStore, 'insert').and.returnValue(Promise.resolve());
        spyOn(taskStore, 'delete').and.returnValue(Promise.resolve());
        spyOn(manager, 'set');
        spyOn(manager, 'cancel');
        spyOn(watchdog, 'set');
        spyOn(watchdog, 'cancel');
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
        expect(watchdog.set).toHaveBeenCalled();
        expect(taskStore.insert).toHaveBeenCalled();
        expect(scheduledTask).not.toBeNull();
    });

    it('does nothing when a task has already been scheduled', async () => {
        spyOn(taskStore, 'get')
            .withArgs(dummyTask)
            .and.returnValue(Promise.resolve(expectedTask));
        const scheduledTask = await androidAlarm.schedule(dummyTask);
        expect(manager.set).not.toHaveBeenCalled();
        expect(watchdog.set).not.toHaveBeenCalled();
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
        expect(watchdog.set).toHaveBeenCalled();
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
        expect(watchdog.cancel).not.toHaveBeenCalled();
        expect(watchdog.set).not.toHaveBeenCalled();
        expect(taskStore.insert).toHaveBeenCalled();
        expect(scheduledTask).not.toBeNull();
    });

    it('removes the highest frequency scheduled task and reschedules the alarm', async () => {
        spyOn(taskStore, 'get')
            .withArgs(higherFreqPT.id)
            .and.returnValue(Promise.resolve(higherFreqPT));
        spyOn(taskStore, 'getAllSortedByInterval').and.returnValue(
            Promise.resolve([higherFreqPT, expectedTask])
        );

        await androidAlarm.cancel(higherFreqPT.id);

        expect(manager.set).toHaveBeenCalledWith(expectedTask.interval);
        expect(taskStore.delete).toHaveBeenCalledWith(higherFreqPT.id);
    });

    it('removes a task different than the one with the highest frequency', async () => {
        spyOn(taskStore, 'get')
            .withArgs(lowerFreqPT.id)
            .and.returnValue(Promise.resolve(lowerFreqPT));
        spyOn(taskStore, 'getAllSortedByInterval').and.returnValue(
            Promise.resolve([expectedTask, lowerFreqPT])
        );

        await androidAlarm.cancel(lowerFreqPT.id);

        expect(manager.cancel).not.toHaveBeenCalled();
        expect(manager.set).not.toHaveBeenCalled();
        expect(watchdog.cancel).not.toHaveBeenCalled();
        expect(watchdog.set).not.toHaveBeenCalled();
        expect(taskStore.delete).toHaveBeenCalledWith(lowerFreqPT.id);
    });

    it('removes a task with the same frequency than the one with the highest frequency', async () => {
        spyOn(taskStore, 'get')
            .withArgs(equalFreqPT.id)
            .and.returnValue(Promise.resolve(equalFreqPT));
        spyOn(taskStore, 'getAllSortedByInterval').and.returnValue(
            Promise.resolve([equalFreqPT, expectedTask])
        );

        await androidAlarm.cancel(equalFreqPT.id);

        expect(manager.cancel).not.toHaveBeenCalled();
        expect(manager.set).not.toHaveBeenCalled();
        expect(watchdog.cancel).not.toHaveBeenCalled();
        expect(watchdog.set).not.toHaveBeenCalled();
        expect(taskStore.delete).toHaveBeenCalledWith(equalFreqPT.id);
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
        expect(watchdog.cancel).toHaveBeenCalled();
        expect(watchdog.set).not.toHaveBeenCalled();
        expect(taskStore.delete).toHaveBeenCalledWith(expectedTask.id);
    });

    it('will not remove a task not scheduled', async () => {
        spyOn(taskStore, 'get')
            .withArgs(expectedTask.id)
            .and.returnValue(Promise.resolve(null));

        await androidAlarm.cancel(expectedTask.id);

        expect(taskStore.delete).not.toHaveBeenCalled();
        expect(manager.cancel).not.toHaveBeenCalled();
        expect(watchdog.cancel).not.toHaveBeenCalled();
        expect(taskStore.delete).not.toHaveBeenCalled();
    });

    it('sets an alarm when there are scheduled tasks and alarm is not up neither the watchdog', async () => {
        spyOnProperty(manager, 'alarmUp').and.returnValue(false);
        spyOnProperty(watchdog, 'alarmUp').and.returnValue(false);
        spyOn(taskStore, 'getAllSortedByInterval').and.returnValue(
            Promise.resolve([expectedTask, lowerFreqPT])
        );

        await androidAlarm.setup();

        expect(manager.set).toHaveBeenCalledWith(expectedTask.interval);
        expect(watchdog.set).toHaveBeenCalled();
    });

    it('sets an alarm when there are scheduled tasks and alarm is not up', async () => {
        spyOnProperty(manager, 'alarmUp').and.returnValue(false);
        spyOnProperty(watchdog, 'alarmUp').and.returnValue(true);
        spyOn(taskStore, 'getAllSortedByInterval').and.returnValue(
            Promise.resolve([expectedTask, lowerFreqPT])
        );

        await androidAlarm.setup();

        expect(manager.set).toHaveBeenCalledWith(expectedTask.interval);
        expect(watchdog.set).not.toHaveBeenCalled();
    });

    it('sets an alarm when there are scheduled tasks and watchdog is not up', async () => {
        spyOnProperty(manager, 'alarmUp').and.returnValue(true);
        spyOnProperty(watchdog, 'alarmUp').and.returnValue(false);
        spyOn(taskStore, 'getAllSortedByInterval').and.returnValue(
            Promise.resolve([expectedTask, lowerFreqPT])
        );

        await androidAlarm.setup();

        expect(manager.set).not.toHaveBeenCalled();
        expect(watchdog.set).toHaveBeenCalled();
    });

    it('does not set an alarm when there are no scheduled tasks', async () => {
        spyOnProperty(manager, 'alarmUp').and.returnValue(false);
        spyOnProperty(watchdog, 'alarmUp').and.returnValue(false);
        spyOn(taskStore, 'getAllSortedByInterval').and.returnValue(
            Promise.resolve([])
        );

        await androidAlarm.setup();

        expect(manager.set).not.toHaveBeenCalled();
        expect(watchdog.set).not.toHaveBeenCalled();
    });

    it('does not set an alarm when alarm is already up', async () => {
        spyOnProperty(manager, 'alarmUp').and.returnValue(true);
        spyOnProperty(watchdog, 'alarmUp').and.returnValue(true);

        await androidAlarm.setup();

        expect(manager.set).not.toHaveBeenCalled();
        expect(watchdog.set).not.toHaveBeenCalled();
    });
});

function createAlarmManagerMock(): AlarmManager {
    return {
        get alarmUp() {
            return false;
        },
        set(interval: number) {
            return null;
        },
        cancel() {
            return null;
        }
    };
}
