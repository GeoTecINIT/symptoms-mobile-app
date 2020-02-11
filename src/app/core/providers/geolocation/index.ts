import { android as androidApp } from 'tns-core-modules/application/application';

import { Geolocation } from './geolocation';
import { ProviderInterruption } from '../provider-interrupter';
import { Provider } from '../provider';
import { AndroidGeolocationProvider } from './geolocation-provider.android';

const LOCATIONS_TO_COLLECT = 5;
const ACCURACY_WEIGHT = 0.6;
const TIME_DIFF_WEIGHT = 0.4;

export class GeolocationProvider implements Provider {
    constructor(private nativeProvider?: NativeGeolocationProvider) {}

    async checkIfIsReady(): Promise<void> {
        const nativeProvider = this.getNativeProvider();
        if (!nativeProvider.hasPermission()) {
            throw geolocationAccessNotGrantedError;
        }
        const isEnabled = await nativeProvider.isEnabled();
        if (!isEnabled) {
            throw geolocationServicesNotEnabledError;
        }
    }
    async prepare(): Promise<void> {
        const nativeProvider = this.getNativeProvider();
        if (!nativeProvider.hasPermission()) {
            await nativeProvider.requestPermission();
        }
        const isEnabled = await nativeProvider.isEnabled();
        if (!isEnabled) {
            await nativeProvider.enable();
        }
    }
    next(): [Promise<Geolocation>, ProviderInterruption] {
        const [
            pendingLocations,
            stopCollecting
        ] = this.getNativeProvider().next(LOCATIONS_TO_COLLECT);
        const processLocations = this.processLocations(pendingLocations);

        return [processLocations, stopCollecting];
    }

    private async processLocations(
        pendingLocations: Promise<Array<Geolocation>>
    ): Promise<Geolocation> {
        await this.checkIfIsReady();

        const locations = await pendingLocations;
        const currentTime = new Date();
        const bestLocation = locations.reduce(
            (previous, current) =>
                !previous ||
                this.geolocationError(previous, currentTime) >
                    this.geolocationError(current, currentTime)
                    ? current
                    : previous,
            null
        );

        return bestLocation;
    }

    private geolocationError(location: Geolocation, currentTime: Date) {
        const { accuracy, capturedAt } = location;
        const timeDiff = (currentTime.getTime() - capturedAt.getTime()) / 1000;

        return accuracy * ACCURACY_WEIGHT + timeDiff * TIME_DIFF_WEIGHT;
    }

    private getNativeProvider() {
        if (this.nativeProvider) {
            return this.nativeProvider;
        }
        if (androidApp) {
            this.nativeProvider = new AndroidGeolocationProvider();
        } else {
            throw new Error('Not implemented');
        }

        return this.nativeProvider;
    }
}

export interface NativeGeolocationProvider {
    isEnabled(): Promise<boolean>;
    enable(): Promise<void>;
    hasPermission(): boolean;
    requestPermission(): Promise<void>;
    next(quantity: number): [Promise<Array<Geolocation>>, ProviderInterruption];
}

export const geolocationAccessNotGrantedError = new Error(
    'Geolocation permission was not granted'
);

export const geolocationServicesNotEnabledError = new Error(
    'Geolocation services are disabled'
);
