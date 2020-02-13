import { AndroidAlarmScheduler } from '../tasks/scheduler/android/alarms/alarm/scheduler.android';

// WARNING: Update the other occurrences of this line each time it gets modified
@JavaProxy('es.uji.geotec.symptomsapp.BootReceiver')
export class BootReceiver extends android.content.BroadcastReceiver {
    onReceive(
        context: android.content.Context,
        intent: android.content.Intent
    ) {
        this.log('Performing boot initializations');

        const alarmScheduler = new AndroidAlarmScheduler();
        alarmScheduler
            .setup()
            .then(() => this.log('Alarm setup has run'))
            .catch((err) => {
                this.log(`${err}`);
            });
    }

    private log(message: string) {
        console.log(`BootReceiver: ${message}`);
    }
}
