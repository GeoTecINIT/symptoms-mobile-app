import { Location } from './location';

export interface NativeLocationProvider {
    isEnabled(): Promise<boolean>;
    enable(): void;
    hasPermission(): boolean;
    requestPermission(): Promise<void>;
    next(quantity: number): [Promise<Array<Location>>, ProviderInterruption];
}

export type ProviderInterruption = () => void;
