import {
    PlannedTasksStore,
    plannedTasksDB
} from '../persistence/planned-tasks-store';
import { TaskScheduler, taskScheduler as getTaskScheduler } from './scheduler';

export class TaskCancelManager {
    constructor(
        private taskStore: PlannedTasksStore = plannedTasksDB,
        private taskScheduler?: TaskScheduler
    ) {}

    async init(): Promise<void> {
        throw new Error('Not implemented');
    }

    private getTaskScheduler(): TaskScheduler {
        if (!this.taskScheduler) {
            this.taskScheduler = getTaskScheduler();
        }

        return this.taskScheduler;
    }
}
