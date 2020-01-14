import { android as androidApp } from 'tns-core-modules/application/application';
import { scheduleAlarm } from './alarms/alarm-scheduler.android';
import { getTask } from '../tasks/task-provider';
import { uuid } from '../utils/uuid';

export const INTERVAL_KEY = 'interval';
export const TASK_NAME_KEY = 'taskName';

export function schedule(time: number, taskName: string): ScheduledTask {
    checkIfTaskExists(taskName);

    if (androidApp) {
        return androidSchedule(time, taskName);
    } else {
        throw new Error('Not implemented yet');
    }
}

function androidSchedule(time: number, taskName: string) {
    if (time >= 5 && time < 60) {
        throw new Error('Not implemented yet');
    } else if (time < 900) {
        return scheduleAlarm({
            task: taskName,
            interval: time * 1000,
            recurrent: true
        });
    } else {
        throw new Error('Not implemented yet');
    }
}

function checkIfTaskExists(name: string) {
    getTask(name);
}

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
