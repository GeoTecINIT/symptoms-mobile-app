import {
    PlatformEvent,
    createEvent,
    CoreEvent,
    emit,
    hasListeners
} from '../events';

export abstract class Task {
    get name(): string {
        return this._name;
    }
    protected taskParams: TaskParams;
    protected invocationEvent: PlatformEvent;

    private _name: string;
    private _executionHistory: Set<string>;

    constructor(
        name: string,
        protected taskConfig: TaskConfig = { background: true }
    ) {
        this._name = name;
        this._executionHistory = new Set();
    }

    /**
     * To be called by the task runner. Performs pre-execution checks and runs the task.
     * @param taskParams The runtime parameters of the task
     * @param invocationEvent The event causing the task to be executed
     */
    async run(
        taskParams: TaskParams,
        invocationEvent: PlatformEvent
    ): Promise<void> {
        this.taskParams = taskParams;
        this.invocationEvent = invocationEvent;

        try {
            await this.checkIfCanRun();
            await this.onRun();
            if (!this.isDone()) {
                this.done(`${this.name}Finished`);
            }
        } catch (err) {
            this.log(
                `Execution failed with params ${JSON.stringify(
                    taskParams
                )} and invocation event ${JSON.stringify(
                    invocationEvent
                )}: ${err}`
            );
            this.emitEndEvent(err);
            throw err;
        }
    }

    /**
     * Indicates if a task runs in background (true by default). Can be configured at instantiation time.
     */
    runsInBackground(): boolean {
        return this.taskConfig.background;
    }

    /**
     * Method to be called by the task runner if the task takes longer than expected to be
     * executed. Should be overridden to gracefully finish a task.
     */
    cancel(): void {
        return null;
    }

    /**
     * Runs task pre run checks (does nothing by default). Should be overridden if certain
     * conditions must be met. Exceptions are expected in case certain task precondition is not met.
     */
    protected checkIfCanRun(): Promise<void> {
        return null;
    }

    /**
     * The content of the task to be executed
     */
    protected abstract onRun(): Promise<void>;

    /**
     * Meant to be used by the task itself. Task result must be emitted through here.
     * @param platformEvent The event containing the result of the task
     */
    protected done(eventName: string, data: { [key: string]: any } = {}) {
        this.markAsDone();
        if (!hasListeners(eventName)) {
            this.emitEndEvent();

            return;
        }

        emit({
            name: eventName,
            id: this.invocationEvent.id,
            data
        });
    }

    /**
     * Meant to be used by the task itself. Logs should be printed through here.
     * @param message The message to be printed
     */
    protected log(message: string) {
        console.log(`Task (${this.name}): ${message}`);
    }

    private emitEndEvent(err?: Error): void {
        const result: TaskChainResult = err
            ? { status: 'error', reason: err }
            : { status: 'ok' };
        const endEvent = createEvent(CoreEvent.TaskChainFinished, {
            id: this.invocationEvent.id,
            data: {
                result
            }
        });
        emit(endEvent);
    }

    private isDone(): boolean {
        return this._executionHistory.has(this.invocationEvent.id);
    }

    private markAsDone() {
        this._executionHistory.add(this.invocationEvent.id);
    }
}

export interface TaskConfig {
    background: boolean;
}

export interface TaskParams {
    [key: string]: any;
}

export interface TaskChainResult {
    status: 'ok' | 'error';
    reason?: Error;
}
