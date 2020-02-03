import { PlannedTasksStore } from '../../persistence/planned-tasks-store';
import { AlarmManager } from './alarm-manager.android';
import { PlannedTask } from '../../tasks/planner/planned-task';
import { RunnableTask } from '../../tasks/runnable-task';

export class AndroidAlarmScheduler {
    constructor(
        private alarmManager: AlarmManager,
        private plannedTaskStore: PlannedTasksStore
    ) {}

    async schedule(runnableTask: RunnableTask): Promise<PlannedTask> {
        const possibleExisting = await this.plannedTaskStore.get(runnableTask);
        if (possibleExisting) {
            return possibleExisting;
        }
        const allTasks = await this.plannedTaskStore.getAllSortedByInterval(
            'alarm'
        );
        if (
            allTasks.length === 0 ||
            allTasks[0].interval > runnableTask.interval
        ) {
            this.alarmManager.set(runnableTask.interval);
        }
        const plannedTask = new PlannedTask('alarm', runnableTask);
        await this.plannedTaskStore.insert(plannedTask);

        return plannedTask;
    }

    async cancel(id: string) {
        const possibleExisting = await this.plannedTaskStore.get(id);
        if (!possibleExisting) {
            return;
        }
        const allTasks = await this.plannedTaskStore.getAllSortedByInterval(
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
        await this.plannedTaskStore.delete(id);
    }
}
