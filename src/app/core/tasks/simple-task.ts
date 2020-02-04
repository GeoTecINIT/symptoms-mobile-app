import { Task, TaskConfig, TaskParams } from './task';
import { PlatformEvent } from '../events';

type SimpleTaskFunction = (
    done: (eventName: string, data: { [key: string]: any }) => void,
    params: TaskParams,
    evt: PlatformEvent
) => Promise<void>;

export class SimpleTask extends Task {
    constructor(
        name: string,
        private functionToBeRun: SimpleTaskFunction,
        taskConfig: TaskConfig = { background: true }
    ) {
        super(name, taskConfig);
    }

    protected async onRun() {
        await this.functionToBeRun(
            (eventName, data) => this.done(eventName, data),
            this.taskParams,
            this.invocationEvent
        );
    }
}
