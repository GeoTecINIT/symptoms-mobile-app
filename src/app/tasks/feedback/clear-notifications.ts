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

        const now = new Date().getTime();
        const oneMinInMilliseconds = 1 * 60 * 1000;
        
        // Mark as seen notifications that are older than 1 min from current timestamp (now)
        notifications.filter(n => (now - n.timestamp.getTime()) > oneMinInMilliseconds ).forEach(n => notificationsManager.markAsSeen(n.id))
    }
}
