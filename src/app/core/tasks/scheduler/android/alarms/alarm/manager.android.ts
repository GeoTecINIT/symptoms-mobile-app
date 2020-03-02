import { android as androidApp } from 'tns-core-modules/application/application';
import { createAlarmReceiverIntent } from '~/app/core/android/intents.android';
import { AbstractAlarmManager } from '../abstract-alarm-manager.android';
import { PowerSavingsManager } from '../power-savings-manager.android';
import { Logger, getLogger } from '~/app/core/utils/logger';

const BATTERY_SAVINGS_THRESHOLD = 15 * 60 * 1000;
const ALARM_SERVICE = android.content.Context.ALARM_SERVICE;

export class AndroidAlarmManager extends AbstractAlarmManager {
    constructor(
        osAlarmManager = androidApp.context.getSystemService(
            ALARM_SERVICE
        ) as android.app.AlarmManager,
        private powerManager = new PowerSavingsManager(),
        private sdkVersion = android.os.Build.VERSION.SDK_INT
    ) {
        super(
            osAlarmManager,
            createAlarmReceiverIntent(androidApp.context),
            getLogger('AndroidAlarmManager')
        );
    }

    set(interval: number): void {
        if (interval < BATTERY_SAVINGS_THRESHOLD) {
            this.checkPowerSavings();
        }

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

        this.logger.info(`Alarm will be triggered in ${interval} ms`);
    }

    private checkPowerSavings(): void {
        if (this.powerManager.areDisabled()) {
            return;
        }
        this.powerManager.requestDeactivation();
    }
}
