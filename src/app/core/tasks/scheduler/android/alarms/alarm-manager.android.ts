import { android as androidApp } from 'tns-core-modules/application/application';
import { createAlarmReceiverIntent } from '~/app/core/utils/android-intents.android';

export interface AlarmManager {
    set(interval: number): void;
    cancel(): void;
}

const ALARM_SERVICE = android.content.Context.ALARM_SERVICE;

export class AndroidAlarmManager implements AlarmManager {
    get alarmUp(): boolean {
        return (
            android.app.PendingIntent.getBroadcast(
                androidApp.context,
                0,
                this.receiverIntent,
                android.app.PendingIntent.FLAG_NO_CREATE
            ) !== null
        );
    }
    private pendingIntent: android.app.PendingIntent;
    private receiverIntent: android.content.Intent;

    constructor(
        private osAlarmManager = androidApp.context.getSystemService(
            ALARM_SERVICE
        ) as android.app.AlarmManager,
        private sdkVersion = android.os.Build.VERSION.SDK_INT
    ) {
        this.receiverIntent = createAlarmReceiverIntent(androidApp.context);
    }

    set(interval: number): void {
        if (this.alarmUp) {
            this.cancel();
        }
        const alarmType = android.app.AlarmManager.RTC_WAKEUP;
        const triggerAtMillis = new Date().getTime() + interval;
        const pendingIntent = this.getPendingIntent();

        if (this.sdkVersion >= 23) {
            this.osAlarmManager.setExactAndAllowWhileIdle(
                alarmType,
                triggerAtMillis,
                pendingIntent
            );
        } else if (this.sdkVersion >= 19) {
            this.osAlarmManager.setExact(
                alarmType,
                triggerAtMillis,
                pendingIntent
            );
        } else {
            this.osAlarmManager.set(alarmType, triggerAtMillis, pendingIntent);
        }
    }

    cancel(): void {
        if (!this.alarmUp) {
            return;
        }
        const pendingIntent = this.getPendingIntent();
        this.osAlarmManager.cancel(pendingIntent);
        pendingIntent.cancel();
        this.pendingIntent = null;
    }

    private getPendingIntent(): android.app.PendingIntent {
        if (!this.pendingIntent) {
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
