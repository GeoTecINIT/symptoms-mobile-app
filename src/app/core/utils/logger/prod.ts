import { Logger } from './common';

export class ProdLogger extends Logger {
    protected logDebug(message: string): void {
        throw new Error('Method not implemented.');
    }

    protected logInfo(message: string): void {
        throw new Error('Method not implemented.');
    }

    protected logWarning(message: string): void {
        throw new Error('Method not implemented.');
    }

    protected logError(message: string): void {
        throw new Error('Method not implemented.');
    }
}
