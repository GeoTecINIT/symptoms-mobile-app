import { PlannedTask, PlanningType } from './planner/planned-task';
import { PlannedTasksStore } from '../persistence/planned-tasks-store';
import { getTask } from './provider';

export class TaskManager {
    private _allTasks: Array<PlannedTask>;

    constructor(
        private planningType: PlanningType,
        private plannedTasksStore: PlannedTasksStore,
        private intervalOffset: number,
        private currentTime = new Date().getTime()
    ) {}

    async tasksToRun(): Promise<Array<PlannedTask>> {
        const allTasks = await this.allTasks();

        const tasksToRunNow = allTasks.filter((task) =>
            this.determineIfTaskShouldBeRun(task)
        );

        return tasksToRunNow;
    }

    async requiresForeground(): Promise<boolean> {
        const tasksToRun = await this.tasksToRun();
        const allRunInBackground = tasksToRun.every((plannedTask) =>
            getTask(plannedTask.name).runsInBackground()
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

        if (tasksToRunInTheFuture.length === 0) {
            return -1;
        }

        const nextIntervals = tasksToRunInTheFuture.map((task) => {
            let next = this.getLastRun(task) + task.interval - this.currentTime;
            if (next < this.intervalOffset) {
                next += task.interval;
            }

            return next;
        });

        const sortedIntervals = nextIntervals.sort((i1, i2) => i1 - i2);

        return sortedIntervals[0];
    }

    private determineIfTaskShouldBeRun(task: PlannedTask): boolean {
        const priorExecution = this.getLastRun(task);

        return (
            this.currentTime >=
            priorExecution + task.interval - this.intervalOffset
        );
    }

    private async allTasks(): Promise<Array<PlannedTask>> {
        if (!this._allTasks) {
            this._allTasks = await this.plannedTasksStore.getAllSortedByInterval(
                this.planningType
            );
        }

        return this._allTasks;
    }

    private getLastRun(task: PlannedTask) {
        return task.lastRun === -1 ? task.createdAt : task.lastRun;
    }
}
