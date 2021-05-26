import {
    DispatchableEvent,
    Task,
    TaskOutcome,
    TaskParams,
} from "@geotecinit/emai-framework/tasks";
import { NotificationDiscardRecord } from "./notification-discard";

export class NotificationDiscardHandlerTask extends Task {
    constructor() {
        super("handleNotificationDiscard", {
            outputEventNames: ["notificationDiscardHandled"],
        });
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const { id, tapAction } = invocationEvent.data;

        return { result: new NotificationDiscardRecord(id, tapAction) };
    }
}
