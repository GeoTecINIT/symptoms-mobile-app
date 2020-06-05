import {
    Task,
    TaskConfig,
    TaskParams,
    TaskOutcome,
} from "nativescript-task-dispatcher/tasks";
import { Provider } from "../../providers/provider";
import { DispatchableEvent } from "nativescript-task-dispatcher/events";

export class ProviderTask extends Task {
    constructor(
        name: string,
        private provider: Provider,
        taskConfig?: TaskConfig
    ) {
        super(name, {
            ...taskConfig,
            // Override declared output events with:
            // {recordType}Acquired
            // Where recordType is the provider output type
            outputEventNames: [`${provider.provides}Acquired`],
        });
    }

    async checkIfCanRun(): Promise<void> {
        await this.provider.checkIfIsReady();
    }

    async prepare(): Promise<void> {
        await this.provider.prepare();
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        await this.checkIfCanRun();
        const [recordPromise, stopRecording] = this.provider.next();
        this.setCancelFunction(() => stopRecording());
        const record = await recordPromise;

        return { eventName: this.outputEventNames[0], result: { record } };
    }
}
