import { ScheduledTasksStore } from '../scheduled-tasks-store';
import { AlarmManager } from './alarm-manager.android';
import { PlannedTask } from '../../runners/task-planner/planned-task';
import { RunnableTask } from '../../runners/runnable-task';

export class AndroidAlarmScheduler {
    constructor(
        private alarmManager: AlarmManager,
        private scheduledTaskStore: ScheduledTasksStore
    ) {}

    async schedule(runnableTask: RunnableTask): Promise<PlannedTask> {
        const possibleExisting = await this.scheduledTaskStore.get(
            runnableTask
        );
        if (possibleExisting) {
            return possibleExisting;
        }
        const allTasks = await this.scheduledTaskStore.getAllSortedByInterval(
            'alarm'
        );
        if (
            allTasks.length === 0 ||
            allTasks[0].interval > runnableTask.interval
        ) {
            this.alarmManager.set(runnableTask.interval);
        }
        const plannedTask = new PlannedTask('alarm', runnableTask);
        await this.scheduledTaskStore.insert(plannedTask);

        return plannedTask;
    }

    async cancel(id: string) {
        const possibleExisting = await this.scheduledTaskStore.get(id);
        if (!possibleExisting) {
            return;
        }
        const allTasks = await this.scheduledTaskStore.getAllSortedByInterval(
            'alarm'
        );
        if (allTasks.length === 1) {
            this.alarmManager.cancel();
        } else if (
            allTasks[0].interval === possibleExisting.interval &&
            allTasks[1].interval !== possibleExisting.interval
        ) {
            this.alarmManager.set(allTasks[1].interval);
        }
        await this.scheduledTaskStore.delete(id);
    }
}
