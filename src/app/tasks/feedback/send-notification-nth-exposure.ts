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
// ONLY if number of exposures match the taskParams variable.
export class SendNotificationNthExposure extends Task {
    constructor(private store: ExposuresStore = exposures) {
        super("sendNotificationNthExposure");
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        try {
            const { numberOfExposure, ...notificationContent } = taskParams;

            // Get exposures
            const exposuresDone = await this.store.getAll();

            if (exposuresDone.length !== numberOfExposure) return;
            
            return sendNotificationTask().run(notificationContent, invocationEvent);
        } catch (e) {
            getLogger("SendNotificationNthExposure").warn(`Was not possible to send a first-time notification. Reason ${e}`)
            
            // Default message is sent if there is any error
            return;
        }
    }
}
