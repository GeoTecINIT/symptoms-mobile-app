import { AbstractLogger } from './abstract';

export class DevLogger extends AbstractLogger {
    constructor(tag: string, private console: Console = console) {
        super(tag);
    }

    protected logDebug(message: string): void {
        this.console.debug(message);
    }

    protected logInfo(message: string): void {
        this.console.info(message);
    }

    protected logWarning(message: string): void {
        this.console.warn(message);
    }

    protected logError(message: string): void {
        this.console.error(message);
    }
}
