import { DispatchableEvent, Task, TaskOutcome, TaskParams } from "@awarns/core/tasks";
import { sendNotificationTask } from "@awarns/notifications";

import { getLogger } from "~/app/core/utils/logger";

import {
    exposures,
    ExposuresStore,
} from "~/app/core/persistence/exposures";

// This task is an extension of the sendNotification task. 

// It should be used exactly as default sendNotification task as it will
// send a notification after receiving the event indicated in the graph
// ONLY if there are no exposures.
export class SendNotificationOnlyFirstTime extends Task {
    constructor(private store: ExposuresStore = exposures) {
        super("sendNotificationOnlyFirstTime");
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        try {
            // Get exposures
            const exposuresDone = await this.store.getAll();

            // If no. exposures is not 0 return void, otherwise send a notification,
            if (exposuresDone.length !== 0) return;
            
            return sendNotificationTask().run(taskParams, invocationEvent);
        } catch (e) {
            getLogger("sendNotificationOnlyFirstTime").warn(`Was not possible to send a first-time notification. Reason ${e}`)
            
            // Default message is sent if there is any error
            return;
        }
    }
}
