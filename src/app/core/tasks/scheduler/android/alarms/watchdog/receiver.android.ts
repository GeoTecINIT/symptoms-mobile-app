import { AndroidAlarmScheduler } from '../alarm/scheduler.android';
import { getLogger } from '~/app/core/utils/logger';

// WARNING: Update the other occurrences of this line each time it gets modified
@JavaProxy('es.uji.geotec.symptomsapp.alarms.WatchdogReceiver')
export class WatchdogReceiver extends android.content.BroadcastReceiver {
    onReceive(
        context: android.content.Context,
        intent: android.content.Intent
    ) {
        const logger = getLogger('WatchdogReceiver');
        logger.info('Checking alarm status');

        const alarmScheduler = new AndroidAlarmScheduler();
        alarmScheduler
            .setup()
            .then(() => logger.debug('Alarm setup has run'))
            .catch((err) => {
                logger.error(err);
            });
    }
}
