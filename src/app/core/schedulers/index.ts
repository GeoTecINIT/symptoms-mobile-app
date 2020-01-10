import { android as androidApp } from 'tns-core-modules/application/application';
import { AlarmScheduler } from './alarms/alarm-scheduler.android';
import { getTask } from '../tasks/task-provider';

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
        const alarmScheduler = new AlarmScheduler(time * 1000, taskName);
        // TODO: alarmScheduler.schedule devuelve algo que pasar a ScheduledTask...
        alarmScheduler.schedule();

        return new ScheduledTask();
    } else {
        throw new Error('Not implemented yet');
    }
}

function checkIfTaskExists(name: string) {
    getTask(name);
}

export class ScheduledTask {
    get scheduled(): boolean {
        return false;
    }

    get cancelled(): boolean {
        return false;
    }
}
