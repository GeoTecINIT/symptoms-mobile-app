import { hasPermission } from 'nativescript-permissions';

import { NativeGeolocationProvider, ProviderInterruption } from '.';
import { Geolocation } from './geolocation';

export class AndroidGeolocationProvider implements NativeGeolocationProvider {
    isEnabled(): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    enable(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    // TODO: Check if we should also ask ACCESS_BACKGROUND_LOCATION
    // Explanation: https://developer.android.com/about/versions/10/privacy/changes#app-access-device-location
    // Tutorial: https://medium.com/google-developer-experts/exploring-android-q-location-permissions-64d312b0e2e1
    hasPermission(): boolean {
        return hasPermission(android.Manifest.permission.ACCESS_FINE_LOCATION);
    }
    requestPermission(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    next(
        quantity: number
    ): [Promise<Array<Geolocation>>, ProviderInterruption] {
        throw new Error('Method not implemented.');
    }
}
