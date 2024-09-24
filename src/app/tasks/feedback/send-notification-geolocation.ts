import { DispatchableEvent, Task, TaskOutcome, TaskParams } from "@awarns/core/tasks";
import { sendNotificationTask, TapActionType } from "@awarns/notifications";

import { getLogger } from "~/app/core/utils/logger";

import {
    exposures,
    ExposuresStore,
} from "~/app/core/persistence/exposures";

// This task is an extension of the sendNotification task. 

// It should be used exactly as default sendNotification task as it will
// send a notification after receiving the event indicated in the graph
// ONLY if number of exposures match the taskParams variable.
export class SendNotificationWithGeolocation extends Task {
    constructor(private store: ExposuresStore = exposures) {
        super("sendNotificationWithGeolocation");
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        try {
            const { data: { latitude, longitude } } = invocationEvent;

            const coordinates = { latitude, longitude };

            const notificationContent = {
                title: "📍 Ubicación adquirida",
                body: `Latitud: ${latitude} Longitude: ${longitude}`,
                tapAction: {
                    type: TapActionType.ASK_CONFIRMATION,
                    id: "show-geolocation",
                },
            }

            console.log("coordinates 👉👉👉", coordinates)

            // const { numberOfExposure, ...notificationContent } = taskParams;

            // // Get exposures
            // const exposuresDone = await this.store.getAll();

            // if (exposuresDone.length !== numberOfExposure) return;
            
            return sendNotificationTask().run(notificationContent, invocationEvent);
        } catch (e) {
            getLogger("SendNotificationWithGeolocation").warn(`Was not possible to send a notification containing geolocation. Reason ${e}`)
            
            // Default message is sent if there is any error
            return;
        }
    }
}
