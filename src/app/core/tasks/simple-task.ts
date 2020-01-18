import { Task } from '.';

export class SimpleTask extends Task {
    functionToBeRun: () => any;

    constructor(f: () => any) {
        super();
        this.functionToBeRun = f;
    }

    run() {
        this.functionToBeRun();
    }
}
