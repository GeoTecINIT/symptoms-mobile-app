import { android as androidApp } from 'tns-core-modules/application/application';
import { ScheduledTask } from './scheduled-task';
import { checkIfTaskExists } from '../tasks/task-provider';
import { AndroidAlarmScheduler } from './alarms/alarm-scheduler.android';
import { AndroidAlarmManager } from './alarms/alarm-manager.android';
import { scheduledTasksDB } from './scheduled-tasks-store';

export async function schedule(
    time: number,
    taskName: string
): Promise<ScheduledTask> {
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
        return androidAlarmScheduler().schedule({
            task: taskName,
            interval: time * 1000,
            recurrent: true
        });
    } else {
        throw new Error('Not implemented yet');
    }
}

let _androidAlarmScheduler = null;
function androidAlarmScheduler() {
    if (!_androidAlarmScheduler) {
        _androidAlarmScheduler = new AndroidAlarmScheduler(
            new AndroidAlarmManager(),
            scheduledTasksDB
        );
    }

    return _androidAlarmScheduler;
}
