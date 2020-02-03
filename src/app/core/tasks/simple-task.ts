import { Task } from './task';

export class SimpleTask extends Task {
    constructor(
        private functionToBeRun: () => Promise<any>,
        private taskConfig: SimpleTaskConfig = { background: true }
    ) {
        super();
    }

    async run() {
        await this.functionToBeRun();
    }

    runsInBackground() {
        return this.taskConfig.background;
    }
}

interface SimpleTaskConfig {
    background: boolean;
}
