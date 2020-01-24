import { NativeLocationProvider, ProviderInterruption } from '.';
import { Location } from './location';

export class AndroidLocationProvider implements NativeLocationProvider {
    isEnabled(): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    enable(): void {
        throw new Error('Method not implemented.');
    }
    hasPermission(): boolean {
        throw new Error('Method not implemented.');
    }
    requestPermission(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    next(quantity: number): [Promise<Array<Location>>, ProviderInterruption] {
        throw new Error('Method not implemented.');
    }
}
