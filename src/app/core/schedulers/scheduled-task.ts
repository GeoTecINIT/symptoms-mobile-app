import { uuid } from '../utils/uuid';

type ScheduleType = 'alarm';

export class ScheduledTask {
    task: string;
    interval: number;
    recurrent: boolean;

    constructor(
        public type: ScheduleType,
        task: TaskToSchedule,
        public id = uuid(),
        public createdAt = new Date().getTime(),
        public lastRun = -1,
        public errorCount = 0,
        public timeoutCount = 0
    ) {
        this.task = task.task;
        this.interval = task.interval;
        this.recurrent = task.recurrent;
    }
}

export interface TaskToSchedule {
    task: string;
    interval: number;
    recurrent: boolean;
}
