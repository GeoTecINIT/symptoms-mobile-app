import { PlatformEvent } from '../events';

export abstract class Task {
    // TODO: custom run code should be in onRun instead.
    // Run it from here and check if code canRun also
    // Receives params and platformEvent (optional)
    abstract run(
        taskParams?: TaskParams,
        platformEvent?: PlatformEvent
    ): Promise<any>;

    canRun() {
        return true;
    }

    runsInBackground(): boolean {
        return true;
    }

    // TODO: Implement this please
    cancel() {
        console.log('Task cancelled!');
    }
}

export interface TaskParams {
    [key: string]: any;
}
