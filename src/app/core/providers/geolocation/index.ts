import { Geolocation } from './geolocation';

export interface NativeGeolocationProvider {
    isEnabled(): Promise<boolean>;
    enable(): Promise<void>;
    hasPermission(): boolean;
    requestPermission(): Promise<void>;
    next(quantity: number): [Promise<Array<Geolocation>>, ProviderInterruption];
}

export type ProviderInterruption = () => void;

export const geolocationAccessNotGrantedError = new Error(
    'Geolocation permission was not granted'
);
