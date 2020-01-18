import { Task } from './task';

export class SimpleTask extends Task {
    constructor(private functionToBeRun: () => any, private background = true) {
        super();
    }

    run() {
        this.functionToBeRun();
    }

    runsInBackground() {
        return this.background;
    }
}
