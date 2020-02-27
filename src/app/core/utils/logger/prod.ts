import { AbstractLogger } from './abstract';

export class ProdLogger extends AbstractLogger {
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
