import { ApplicationSettings } from "@nativescript/core";

import {
    DispatchableEvent,
    Task,
    TaskOutcome,
    TaskParams,
} from "@awarns/core/tasks";
import { sendNotificationTask } from "@awarns/notifications";

import { getLogger } from "~/app/core/utils/logger";

const PATIENT_MESSAGES_KEY = "PATIENT_MESSAGES";

type Message = {
    event: string;
    name: string;
    title: string;
    body: string;
};

// This task is an extension of the sendNotification task.

// It should be used exactly as default sendNotification task as it will
// send a custom notification if it is available or possible.
export class CustomNotification extends Task {
    constructor() {
        super("sendCustomNotification");
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        try {
            // Get custom message if possible
            const unparsedMessages =
                ApplicationSettings.getString(PATIENT_MESSAGES_KEY);
            const messages: Message[] = JSON.parse(unparsedMessages);
            const customMessage: Message = messages.find(
                (m) => m.event === invocationEvent.name
            );

            // Send default message if no custom message was found
            if (customMessage === undefined) {
                return sendNotificationTask().run(taskParams, invocationEvent);
            }

            // Send custom message saved in device's storage (if present)
            return sendNotificationTask().run(
                {
                    title: customMessage.title,
                    body: customMessage.body,
                    tapAction: taskParams["tapAction"],
                },
                invocationEvent
            );
        } catch (e) {
            getLogger("sendCustomNotificationTask").warn(
                `Was not possible to send a custom notification. Reason ${e}`
            );

            // Default message is sent if there is any error
            return sendNotificationTask().run(taskParams, invocationEvent);
        }
    }
}
