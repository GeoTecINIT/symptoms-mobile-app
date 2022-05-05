import { RandomNotificationSenderTask } from "./random-sender";
import { makeTraceable } from "@awarns/tracing";

export const notificationsTasks = [
    ...makeTraceable([
        new RandomNotificationSenderTask("sendRandomNotification"),
    ]),
];
