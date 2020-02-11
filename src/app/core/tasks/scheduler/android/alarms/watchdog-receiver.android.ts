import { AndroidAlarmScheduler } from './alarm-scheduler.android';

// WARNING: Update the other occurrences of this line each time it gets modified
@JavaProxy('es.uji.geotec.symptomsapp.alarms.WatchdogReceiver')
export class WatchdogReceiver extends android.content.BroadcastReceiver {
    onReceive(
        context: android.content.Context,
        intent: android.content.Intent
    ) {
        this.log('Watchdog triggered');

        const alarmScheduler = new AndroidAlarmScheduler();
        alarmScheduler.setup().catch((err) => {
            this.log(`${err}`);
        });
    }

    private log(message: string) {
        console.log(`WatchdogReceiver: ${message}`);
    }
}
