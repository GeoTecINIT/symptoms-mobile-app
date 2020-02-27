import { AndroidAlarmScheduler } from '../tasks/scheduler/android/alarms/alarm/scheduler.android';
import { getLogger } from '../utils/logger';

// WARNING: Update the other occurrences of this line each time it gets modified
@JavaProxy('es.uji.geotec.symptomsapp.BootReceiver')
export class BootReceiver extends android.content.BroadcastReceiver {
    onReceive(
        context: android.content.Context,
        intent: android.content.Intent
    ) {
        const logger = getLogger('BootReceiver');
        logger.info('Performing boot initializations');

        const alarmScheduler = new AndroidAlarmScheduler();
        alarmScheduler
            .setup()
            .then(() => logger.debug('Alarm setup has run'))
            .catch((err) => {
                logger.error(`${err}`);
            });
    }
}
