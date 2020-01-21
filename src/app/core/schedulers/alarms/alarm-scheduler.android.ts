import { ScheduledTasksStore } from '../scheduled-tasks-store';
import { AlarmManager } from './alarm-manager.android';
import { TaskToSchedule, ScheduledTask } from '../scheduled-task';

export class AndroidAlarmScheduler {
    constructor(
        private alarmManager: AlarmManager,
        private scheduledTaskStore: ScheduledTasksStore
    ) {}

    async schedule(taskToSchedule: TaskToSchedule): Promise<ScheduledTask> {
        const possibleExisting = await this.scheduledTaskStore.get(
            taskToSchedule
        );
        if (possibleExisting) {
            return possibleExisting;
        }
        const allTasks = await this.scheduledTaskStore.getAllSortedByInterval(
            'alarm'
        );
        if (
            allTasks.length === 0 ||
            allTasks[0].interval > taskToSchedule.interval
        ) {
            this.alarmManager.set(taskToSchedule.interval);
        }
        const scheduledTask = new ScheduledTask('alarm', taskToSchedule);
        await this.scheduledTaskStore.insert(scheduledTask);

        return scheduledTask;
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