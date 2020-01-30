export abstract class Task {
    constructor(private _timeout = 15000) {}

    // TODO: custom run code should be in onRun instead.
    // Run it from here and check if code canRun also
    // Receives params and platformEvent (optional)
    abstract run(): Promise<any>;

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

    get timeout(): number {
        return this._timeout;
    }
}

export interface TaskParams {
    [key: string]: any;
}
