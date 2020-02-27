export abstract class AbstractLogger {
    constructor(private tag: string) {}

    debug(message: string) {
        this.logDebug(this.formatMessage(LogType.Debug, message));
    }

    info(message: string) {
        this.logInfo(this.formatMessage(LogType.Info, message));
    }

    warn(message: string) {
        this.logWarning(this.formatMessage(LogType.Warning, message));
    }

    error(message: string) {
        this.logError(this.formatMessage(LogType.Error, message));
    }

    protected abstract logDebug(message: string): void;

    protected abstract logInfo(message: string): void;

    protected abstract logWarning(message: string): void;

    protected abstract logError(message: string): void;

    private formatMessage(type: LogType, message: string) {
        return `[${type}] ${this.tag}: ${message}`;
    }
}

enum LogType {
    Debug = 'DEBUG',
    Info = 'INFO',
    Warning = 'WARN',
    Error = 'ERROR'
}
