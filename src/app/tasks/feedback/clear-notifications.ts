import { DispatchableEvent, Task, TaskParams } from "@awarns/core/tasks";
import {
    notificationsManager,
    notifications as notificationsStore,
} from "@awarns/notifications";
import { firstValueFrom } from "rxjs";

// This task is meant to be ran when the patient finish an exposure
export class ClearNotifications extends Task {
    constructor() {
        super("clearNotifications");
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void> {
        const notifications = await firstValueFrom(notificationsStore.list())
        notifications.forEach(n => notificationsManager.markAsSeen(n.id))
    }
}
