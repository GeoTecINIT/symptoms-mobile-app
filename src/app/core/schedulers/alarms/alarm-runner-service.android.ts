const RUN_IN_FOREGROUND = 'foreground';

// WARNING: Update the other occurrences of this line each time it gets modified
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
