import { Task, TaskConfig, TaskParams } from '../task';
import { PlatformEvent } from '../../events';

type SimpleTaskFunction = (
    done: (eventName: string, data: { [key: string]: any }) => void,
    params: TaskParams,
    evt: PlatformEvent,
    onCancel: (f: () => void) => void
) => Promise<void>;

export class SimpleTask extends Task {
    constructor(
        name: string,
        private functionToBeRun: SimpleTaskFunction,
        taskConfig?: TaskConfig
    ) {
        super(name, taskConfig);
    }

    protected async onRun() {
        const onCancel = (f: () => void) => this.setCancelFunction(f);
        await this.functionToBeRun(
            (eventName, data) => this.done(eventName, data),
            this.taskParams,
            this.invocationEvent,
            onCancel
        );
    }
}
