import { ProviderInterruption } from './provider-interrupter';

export interface Provider {
    next(): [Promise<void>, ProviderInterruption];
    isReady(): Promise<boolean>;
    prepare(): Promise<void>;
}
