import { SchedulerType, ScheduledTask } from './scheduled-task';
import { ScheduledTasksStore } from './scheduled-tasks-store';

export class TaskPlanner {
    private currentTime: number;

    constructor(
        private schedulerType: SchedulerType,
        private scheduledTasksStore: ScheduledTasksStore,
        private intervalOffset: number
    ) {
        this.currentTime = new Date().getTime();
    }

    async tasksToRun(): Promise<Array<ScheduledTask>> {
        const allTasks = await this.scheduledTasksStore.getAllSortedByInterval(
            this.schedulerType
        );
        const tasksToRunNow = allTasks.filter((task) =>
            this.determineIfTaskShouldBeRun(task)
        );

        return tasksToRunNow;
    }

    async requiresForeground(): Promise<boolean> {
        throw new Error('Not implemented');
    }

    async willContinue(): Promise<boolean> {
        throw new Error('Not implemented');
    }

    async nextInterval(): Promise<number> {
        throw new Error('Not implemented');
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
}
