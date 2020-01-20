export abstract class Task {
    constructor(private _timeout = 15000) {}

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
