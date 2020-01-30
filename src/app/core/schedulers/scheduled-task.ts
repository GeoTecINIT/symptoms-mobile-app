import { uuid } from '../utils/uuid';
import { RunnableTask } from '../runners/runnable-task';

export type SchedulerType = 'alarm';

export class ScheduledTask {
    task: string;
    interval: number;
    recurrent: boolean;

    constructor(
        public type: SchedulerType,
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
