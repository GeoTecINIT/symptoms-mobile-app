import { uuid } from '../../utils/uuid';
import { RunnableTask } from '../runnable-task';

export type PlanningType = 'alarm';

export class PlannedTask {
    task: string;
    interval: number;
    recurrent: boolean;

    constructor(
        public type: PlanningType,
        task: RunnableTask,
        public id = uuid(),
        public createdAt = new Date().getTime(),
        public lastRun = -1,
        public errorCount = 0,
        public timeoutCount = 0
    ) {
        this.task = task.name;
        this.interval = task.interval;
        this.recurrent = task.recurrent;
    }
}
