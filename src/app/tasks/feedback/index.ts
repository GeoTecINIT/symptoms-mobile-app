import { Task } from "@awarns/core/tasks";
import { FeedbackTracker } from "~/app/tasks/feedback/feedback-tracker";
import { FeedbackDeliveryLimiter } from "~/app/tasks/feedback/feedback-delivery-limiter";

export const feedbackTasks: Array<Task> = [
    new FeedbackTracker(),
    new FeedbackDeliveryLimiter(),
];
