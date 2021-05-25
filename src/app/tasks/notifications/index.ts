import { Task } from "@geotecinit/emai-framework/tasks";
import { NotificationTapHandlerTask } from "~/app/tasks/notifications/notification-tap-handler";
import { NotificationDiscardHandlerTask } from "~/app/tasks/notifications/notification-discard-handler";

export const notificationTasks: Array<Task> = [
    new NotificationTapHandlerTask(),
    new NotificationDiscardHandlerTask(),
];
