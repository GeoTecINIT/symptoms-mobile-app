import {
    DispatchableEvent,
    Task,
    TaskOutcome,
    TaskParams,
} from "@awarns/core/tasks";

export class EventConverterTask extends Task {
    constructor(outputEvent: string) {
        super(`emit${titelize(outputEvent)}Event`, {
            outputEventNames: [outputEvent],
        });
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        return { result: invocationEvent.data };
    }
}

function titelize(str: string) {
    return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
}
