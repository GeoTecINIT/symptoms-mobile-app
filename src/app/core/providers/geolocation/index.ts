import { Geolocation } from './geolocation';
import { ProviderInterruption } from '../provider-interrupter';

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
