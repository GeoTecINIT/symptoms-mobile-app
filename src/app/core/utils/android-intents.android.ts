const appPackage = 'es.uji.geotec.symptomsapp';

export function createAlarmReceiverIntent(appContext: android.content.Context) {
    return createAppComponentIntent(appContext, '.alarms.AlarmReceiver');
}

const ARS_RUN_IN_FOREGROUND = 'foreground';
export function createAlarmRunnerServiceIntent(
    appContext: android.content.Context,
    runInForeground: boolean
) {
    const intent = createAppComponentIntent(
        appContext,
        '.alarms.AlarmRunnerService'
    );
    intent.putExtra(ARS_RUN_IN_FOREGROUND, runInForeground);

    return intent;
}

export function unpackAlarmRunnerServiceIntent(
    intent: android.content.Intent
): any {
    if (!intent) {
        return;
    }

    return {
        runInForeground: intent.getBooleanExtra(ARS_RUN_IN_FOREGROUND, false)
    };
}

function createAppComponentIntent(
    appContext: android.content.Context,
    relativeClassPath: string
): android.content.Intent {
    const intent = new android.content.Intent();
    const componentRef = new android.content.ComponentName(
        appContext,
        appPackage + relativeClassPath
    );
    intent.setComponent(componentRef);

    return intent;
}
