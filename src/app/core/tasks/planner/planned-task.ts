import { uuid } from '../../utils/uuid';
import { RunnableTask } from '../runnable-task';
import { TaskParams } from '../task';

export type PlanningType = 'alarm';

export class PlannedTask {
    name: string;
    interval: number;
    recurrent: boolean;
    params: TaskParams;
    cancelEvent: string;

    constructor(
        public planningType: PlanningType,
        task: RunnableTask,
        public id = uuid(),
        public createdAt = new Date().getTime(),
        public lastRun = -1,
        public errorCount = 0,
        public timeoutCount = 0
    ) {
        this.name = task.name;
        this.interval = task.interval;
        this.recurrent = task.recurrent;
        this.params = task.params;
        this.cancelEvent = task.cancelEvent;
    }
}
