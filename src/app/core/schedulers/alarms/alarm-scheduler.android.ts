import { android as androidApp } from 'tns-core-modules/application/application';
import { AlarmReceiver } from './alarm-receiver.android';

export class AlarmScheduler {
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
}
