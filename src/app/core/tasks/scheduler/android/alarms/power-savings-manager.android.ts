import { android as androidApp } from 'tns-core-modules/application/application';
import {
    appPackage,
    createSavingsDeactivationIntent
} from '~/app/core/android/intents.android';

const POWER_SERVICE = android.content.Context.POWER_SERVICE;

export class PowerSavingsManager {
    constructor(
        private powerManager: android.os.PowerManager = androidApp.context.getSystemService(
            POWER_SERVICE
        ),
        private skdVersion = android.os.Build.VERSION.SDK_INT
    ) {}

    requestDeactivation(): void {
        if (this.areDisabled) {
            return;
        }

        const intent = createSavingsDeactivationIntent();
        androidApp.context.startActivity(intent);
    }

    areDisabled(): boolean {
        if (this.skdVersion < 23) {
            return true;
        }

        return this.powerManager.isIgnoringBatteryOptimizations(appPackage);
    }
}
