import { android as androidApp } from 'tns-core-modules/application/application';
const RUN_IN_FOREGROUND = 'foreground';

@JavaProxy('es.uji.geotec.symptomsapp.alarms.AlarmRunnerService')
export class AlarmRunnerService extends android.app.Service {
    onCreate() {
        super.onCreate();
        console.log('AlarmRunnerService: onCreate called!');
    }

    onStartCommand(
        intent: android.content.Intent,
        flags: number,
        startId: number
    ): number {
        super.onStartCommand(intent, flags, startId);
        console.log('AlarmRunnerService: Service called!');
        if (intent) {
            const runInForeground = intent
                .getExtras()
                .getBoolean(RUN_IN_FOREGROUND);
            console.log(
                `AlarmRunnerService: Running in foreground: ${runInForeground}`
            );
        }
        this.stopSelf(startId);

        return android.app.Service.START_STICKY;
    }

    onBind(intent: android.content.Intent): android.os.IBinder {
        return null; // Service cannot be bound
    }

    onDestroy() {
        console.log('AlarmRunnerService: onDestroy called!');
        super.onDestroy();
    }
}

export function startAlarmRunnerService(inForeground: boolean) {
    const appContext: android.content.Context = androidApp.context;
    const startRunnerService = new android.content.Intent(
        appContext,
        AlarmRunnerService.class
    );
    startRunnerService.putExtra(RUN_IN_FOREGROUND, inForeground);
    if (inForeground) {
        androidx.core.content.ContextCompat.startForegroundService(
            appContext,
            startRunnerService
        );
    } else {
        appContext.startService(startRunnerService);
    }
}
