import { TaskScheduler } from '..';
import { RunnableTask } from '../../runnable-task';
import { PlannedTask, PlanningType } from '../../planner/planned-task';
import { AndroidAlarmScheduler } from '~/app/core/tasks/scheduler/android/alarms/alarm-scheduler.android';
import { plannedTasksDB } from '~/app/core/persistence/planned-tasks-store';
import { checkIfTaskExists } from '../../provider';

export class AndroidTaskScheduler implements TaskScheduler {
    constructor(
        private alarmScheduler = new AndroidAlarmScheduler(),
        private tasksStore = plannedTasksDB
    ) {}

    async schedule(task: RunnableTask): Promise<PlannedTask> {
        checkIfTaskExists(task.name);

        const time = task.interval;
        const taskToSchedule = { ...task, interval: time * 1000 };
        if (time >= 5 && time < 60) {
            throw new Error('Not implemented yet');
        } else if (time < 900) {
            return this.alarmScheduler.schedule(taskToSchedule);
        } else {
            throw new Error('Not implemented yet');
        }
    }

    async cancel(plannedTaskId: string): Promise<void> {
        const task = await this.tasksStore.get(plannedTaskId);
        switch (task.planningType) {
            case PlanningType.Alarm:
                return this.alarmScheduler.cancel(plannedTaskId);
            default:
                throw new Error('Method not implemented.');
        }
    }
}
