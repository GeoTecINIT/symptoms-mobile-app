import { Task } from "@awarns/core/tasks";
import { FeedbackTracker } from "~/app/tasks/feedback/feedback-tracker";
import { FeedbackDeliveryLimiter } from "~/app/tasks/feedback/feedback-delivery-limiter";
import { CustomNotification } from "~/app/tasks/feedback/custom-notifications";
import { ClearNotifications } from "~/app/tasks/feedback/clear-notifications"
import { makeTraceable } from "@awarns/tracing";

export const feedbackTasks: Array<Task> = [
    ...makeTraceable([
        new FeedbackTracker(), 
        new FeedbackDeliveryLimiter(), 
        new CustomNotification(),
        new ClearNotifications(),
    ]),
];
