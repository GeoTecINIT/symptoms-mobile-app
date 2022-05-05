import { DispatchableEvent, Task, TaskParams } from "@awarns/core/tasks";
import {
    feedbackTracking,
    FeedbackTracking,
} from "~/app/core/persistence/feedback-tracking";
import { PatientFeedback } from "~/app/core/modals/feedback";

export class FeedbackTracker extends Task {
    constructor(private store: FeedbackTracking = feedbackTracking) {
        super("trackFeedbackAcquisition");
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void> {
        const feedback = invocationEvent.data as PatientFeedback;

        await this.store.track(feedback.feedbackId);
    }
}
