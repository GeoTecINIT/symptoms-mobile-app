import { DispatchableEvent, Task, TaskParams } from "@awarns/core/tasks";
import {
    feedbackTracking,
    FeedbackTracking,
} from "~/app/core/persistence/feedback-tracking";
import { UserFeedback } from "@awarns/notifications";

export class FeedbackTracker extends Task {
    constructor(private store: FeedbackTracking = feedbackTracking) {
        super("trackFeedbackAcquisition");
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void> {
        const feedback = invocationEvent.data as UserFeedback;

        await this.store.track(feedback.feedbackId);
    }
}
