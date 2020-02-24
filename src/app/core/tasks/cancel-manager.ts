import {
    PlannedTasksStore,
    plannedTasksDB
} from '../persistence/planned-tasks-store';
import { TaskScheduler } from './scheduler';

export class TaskCancelManager {
    constructor(
        private taskStore: PlannedTasksStore = plannedTasksDB,
        private taskScheduler?: TaskScheduler
    ) {}

    init() {
        throw new Error('Not implemented');
    }
}
