export abstract class Task {
    abstract run(): any;

    canRun() {
        return true;
    }

    runsInBackground(): boolean {
        return true;
    }
}
