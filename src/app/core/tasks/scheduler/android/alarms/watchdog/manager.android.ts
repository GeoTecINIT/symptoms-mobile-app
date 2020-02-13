import { android as androidApp } from 'tns-core-modules/application/application';
import { AbstractAlarmManager } from '../abstract-alarm-manager.android';
import { createWatchdogReceiverIntent } from '~/app/core/android/intents.android';

const ALARM_SERVICE = android.content.Context.ALARM_SERVICE;
const WATCHDOG_INTERVAL = 15 * 60 * 1000;

export class WatchdogManager extends AbstractAlarmManager {
    constructor(
        osAlarmManager = androidApp.context.getSystemService(
            ALARM_SERVICE
        ) as android.app.AlarmManager
    ) {
        super(osAlarmManager, createWatchdogReceiverIntent(androidApp.context));
    }

    set(): void {
        if (this.alarmUp) {
            this.cancel();
        }
        const alarmType = android.app.AlarmManager.RTC_WAKEUP;
        const triggerAtMillis = new Date().getTime() + WATCHDOG_INTERVAL;
        const pendingIntent = this.getPendingIntent();

        this.osAlarmManager.setRepeating(
            alarmType,
            triggerAtMillis,
            WATCHDOG_INTERVAL,
            pendingIntent
        );
    }
}
