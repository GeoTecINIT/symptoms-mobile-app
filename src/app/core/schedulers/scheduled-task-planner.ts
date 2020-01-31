import {
    PlanningType,
    PlannedTask
} from '../runners/task-planner/planned-task';
import { PlannedTasksStore } from '../persistence/planned-tasks-store';
import { getTask } from '../tasks/task-provider';

export class ScheduledTaskPlanner {
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
            getTask(plannedTask.task).runsInBackground()
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

    private determineIfTaskShouldBeRun(task: PlannedTask): boolean {
        let priorExecution = task.lastRun;
        if (task.lastRun === -1) {
            priorExecution = task.createdAt;
        }

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
}
