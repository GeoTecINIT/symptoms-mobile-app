import { Task } from './task';

export class SimpleTask extends Task {
    constructor(
        private functionToBeRun: () => Promise<any>,
        private background = true,
        timeout = 100
    ) {
        super(timeout);
    }

    async run() {
        await this.functionToBeRun();
    }

    runsInBackground() {
        return this.background;
    }
}
