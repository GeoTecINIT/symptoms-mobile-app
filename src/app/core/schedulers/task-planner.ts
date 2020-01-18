import { SchedulerType, ScheduledTask } from './scheduled-task';
import { ScheduledTasksStore } from './scheduled-tasks-store';
import { getTask } from '../tasks/task-provider';

export class TaskPlanner {
    private _allTasks: Array<ScheduledTask>;

    constructor(
        private schedulerType: SchedulerType,
        private scheduledTasksStore: ScheduledTasksStore,
        private intervalOffset: number,
        private currentTime = new Date().getTime()
    ) {}

    async tasksToRun(): Promise<Array<ScheduledTask>> {
        const allTasks = await this.allTasks();

        const tasksToRunNow = allTasks.filter((task) =>
            this.determineIfTaskShouldBeRun(task)
        );

        return tasksToRunNow;
    }

    async requiresForeground(): Promise<boolean> {
        const tasksToRun = await this.tasksToRun();
        const allRunInBackground = tasksToRun.every((scheduledTask) =>
            getTask(scheduledTask.task).runsInBackground()
        );

        return !allRunInBackground;
    }

    async willContinue(): Promise<boolean> {
        return (await this.nextInterval()) !== -1;
    }

    async nextInterval(): Promise<number> {
        const allTasks = await this.allTasks();

        if (allTasks.length === 0) {
            return -1;
        }

        const tasksToRunInTheFuture = allTasks.filter(
            (task) => task.recurrent || !this.determineIfTaskShouldBeRun(task)
        );

        return tasksToRunInTheFuture.length === 0
            ? -1
            : tasksToRunInTheFuture[0].interval;
    }

    private determineIfTaskShouldBeRun(task: ScheduledTask): boolean {
        let priorExecution = task.lastRun;
        if (task.lastRun === -1) {
            priorExecution = task.createdAt;
        }

        return (
            this.currentTime >=
            priorExecution + task.interval - this.intervalOffset
        );
    }

    private async allTasks(): Promise<Array<ScheduledTask>> {
        if (!this._allTasks) {
            this._allTasks = await this.scheduledTasksStore.getAllSortedByInterval(
                this.schedulerType
            );
        }

        return this._allTasks;
    }
}
