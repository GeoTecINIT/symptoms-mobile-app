import { Logger } from './common';

export class DevLogger extends Logger {
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
