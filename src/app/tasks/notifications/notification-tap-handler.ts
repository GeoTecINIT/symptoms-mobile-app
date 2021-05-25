import {
    DispatchableEvent,
    Task,
    TaskOutcome,
    TaskParams,
} from "@geotecinit/emai-framework/tasks";
import { NotificationTapRecord } from "./notification-tap";

export class NotificationTapHandlerTask extends Task {
    constructor() {
        super("handleNotificationTap", {
            outputEventNames: ["notificationTapHandled"],
        });
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const { id, tapAction } = invocationEvent.data;

        return { result: new NotificationTapRecord(id, tapAction) };
    }
}
