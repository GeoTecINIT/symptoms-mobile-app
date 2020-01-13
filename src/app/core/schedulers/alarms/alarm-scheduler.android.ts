import { android as androidApp } from 'tns-core-modules/application/application';
import { AlarmReceiver } from './alarm-receiver.android';
import { INTERVAL_KEY, TASK_NAME_KEY, TaskToSchedule, ScheduledTask } from '..';

let alarmScheduler: AlarmScheduler;
let scheduledTaskStore: ScheduledTaskStore;

export function scheduleAlarm(taskToSchedule: TaskToSchedule): ScheduledTask {
    const possibleExisting = scheduledTaskStore.get(taskToSchedule);
    if (possibleExisting) {
        return possibleExisting;
    }
    const allTasks = scheduledTaskStore.getAll();
    if (allTasks.length === 0) {
        alarmScheduler.set(taskToSchedule.in);
    }
    const scheduledTask = new ScheduledTask('alarm', taskToSchedule);
    scheduledTaskStore.insert(scheduledTask);

    return scheduledTask;
}

export function cancelAlarm(id: string) {
    throw new Error('Not implemented');
}

export function setAlarmScheduler(scheduler: AlarmScheduler) {
    alarmScheduler = scheduler;
}

export function setScheduledTaskStore(taskStore: ScheduledTaskStore) {
    scheduledTaskStore = taskStore;
}

export interface AlarmScheduler {
    set(interval: number): void;
    cancel(): void;
}

export interface ScheduledTaskStore {
    insert(scheduledTask: ScheduledTask): void;
    delete(task: string): void;
    get(task: TaskToSchedule | string): ScheduledTask;
    getAll(): Array<ScheduledTask>;
    increaseErrorCount(task: string): void;
    increaseTimeoutCount(task: string): void;
    updateLastRun(task: string, timestamp: number): void;
}

/* export class AlarmScheduler {
    interval: number;
    taskName: string;

    alarmManager: android.app.AlarmManager;
    receiverIntent: android.content.Intent;
    pendingIntent: android.app.PendingIntent;

    constructor(interval: number, taskName: string) {
        this.interval = interval;
        this.taskName = taskName;
        this.alarmManager = androidApp.context.getSystemService(
            android.content.Context.ALARM_SERVICE
        );
        this.receiverIntent = new android.content.Intent(
            androidApp.context,
            AlarmReceiver.class
        );
        this.receiverIntent.putExtra(INTERVAL_KEY, interval);
        this.receiverIntent.putExtra(TASK_NAME_KEY, taskName);
        this.pendingIntent = null;
    }

    schedule() {
        const sdkVersion = android.os.Build.VERSION.SDK_INT;

        const alarmType = android.app.AlarmManager.RTC_WAKEUP;
        const triggerAtMillis = new Date().getTime() + this.interval;
        const pendingIntent = this.getPendingIntent();

        if (sdkVersion >= 23) {
            this.alarmManager.setExactAndAllowWhileIdle(
                alarmType,
                triggerAtMillis,
                pendingIntent
            );
        } else if (sdkVersion >= 19) {
            this.alarmManager.setExact(
                alarmType,
                triggerAtMillis,
                pendingIntent
            );
        } else {
            this.alarmManager.set(alarmType, triggerAtMillis, pendingIntent);
        }
    }

    private getPendingIntent(): android.app.PendingIntent {
        if (this.pendingIntent === null) {
            this.pendingIntent = android.app.PendingIntent.getBroadcast(
                androidApp.context,
                0,
                this.receiverIntent,
                0
            );
        }

        return this.pendingIntent;
    }
} */
