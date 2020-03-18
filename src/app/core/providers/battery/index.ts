import { Provider } from '../provider';
import { BatteryLevel } from './battery-level';
import { ProviderInterruption } from '../provider-interrupter';
import { android as androidApp } from 'tns-core-modules/application/application';

export class BatteryProvider implements Provider {
    constructor(private sdkVersion?: number) {
        if (androidApp && !this.sdkVersion) {
            this.sdkVersion = android.os.Build.VERSION.SDK_INT;
        }
    }

    next(): [Promise<BatteryLevel>, ProviderInterruption] {
        const value = this.getBatteryPercentage();
        const batteryLevel = BatteryLevel.fromPercentage(value);

        return [Promise.resolve(batteryLevel), () => null];
    }

    checkIfIsReady(): Promise<void> {
        return Promise.resolve();
    }

    prepare(): Promise<void> {
        return Promise.resolve();
    }

    private getBatteryPercentage(): number {
        if (!androidApp) {
            return -1;
        }
        if (this.sdkVersion >= 21) {
            const batteryManager: android.os.BatteryManager = androidApp.context.getSystemService(
                android.content.Context.BATTERY_SERVICE
            );

            return batteryManager.getIntProperty(
                android.os.BatteryManager.BATTERY_PROPERTY_CAPACITY
            );
        }
        const intentFilter = new android.content.IntentFilter(
            android.content.Intent.ACTION_BATTERY_CHANGED
        );
        const batteryStatus = androidApp.context.registerReceiver(
            null,
            intentFilter
        );

        const level = batteryStatus
            ? batteryStatus.getIntExtra(
                  android.os.BatteryManager.EXTRA_LEVEL,
                  -1
              )
            : -1;
        const scale = batteryStatus
            ? batteryStatus.getIntExtra(
                  android.os.BatteryManager.EXTRA_SCALE,
                  -1
              )
            : -1;

        const batteryPercentage = level / scale;

        return Math.trunc(batteryPercentage * 100);
    }
}
