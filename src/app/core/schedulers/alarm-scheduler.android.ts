import { android as androidApp } from 'tns-core-modules/application/application';

export class AlarmScheduler {
    interval: number;
    task;

    alarmManager: android.app.AlarmManager;
    receiverIntent: android.content.Intent;
    pendingIntent: android.app.PendingIntent;

    constructor(interval: number, task) {
        this.interval = interval;
        this.task = task;
        this.alarmManager = androidApp.context.getSystemService(
            android.content.Context.ALARM_SERVICE
        );
        this.receiverIntent = new android.content.Intent(androidApp.context);
        this.pendingIntent = null;
    }

    schedule() {
        const triggerAtMillis = new Date().getTime() + this.interval;
        // TODO: CHECk API LEVEL
        this.alarmManager.setExact(
            android.app.AlarmManager.RTC_WAKEUP,
            triggerAtMillis,
            this.getPendingIntent()
        );
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
