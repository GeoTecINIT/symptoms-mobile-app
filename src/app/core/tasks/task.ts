import {
    PlatformEvent,
    createEvent,
    CoreEvent,
    emit,
    hasListeners
} from '../events';

export abstract class Task {
    private taskParams: TaskParams;
    private invocationEvent: PlatformEvent;

    constructor(private name: string) {}

    // TODO: custom run code should be in onRun instead.
    // Run it from here and check if code canRun also
    // Receives params and platformEvent (optional)
    async run(
        taskParams: TaskParams,
        invocationEvent: PlatformEvent
    ): Promise<any> {
        this.taskParams = taskParams;
        this.invocationEvent = invocationEvent;

        try {
            await this.checkIfCanRun();

            await this.onRun();
        } catch (err) {
            console.log(
                `Task ${this.name} execution failed with params ${taskParams} and invocation event ${invocationEvent}: ${err}`
            );
            this.emitEndEvent(err);
            throw err;
        }
    }

    /**
     * Override this method to throw an exception if some task preconditions are not met
     */
    checkIfCanRun(): Promise<void> {
        return null;
    }

    runsInBackground(): boolean {
        return true;
    }

    // TODO: Implement this please
    cancel() {
        console.log('Task cancelled!');
    }

    protected abstract onRun(): Promise<any>;

    protected done(platformEvent: PlatformEvent) {
        if (!hasListeners(platformEvent.name)) {
            this.emitEndEvent();

            return;
        }

        emit(platformEvent);
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
}

export interface TaskParams {
    [key: string]: any;
}

export interface TaskChainResult {
    status: 'ok' | 'error';
    reason?: Error;
}
