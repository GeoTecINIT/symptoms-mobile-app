import {
    DispatchableEvent,
    TaskParams,
    TraceableTask,
} from "@geotecinit/emai-framework/tasks";
import {
    feedbackTracking,
    FeedbackTracking,
} from "~/app/core/persistence/feedback-tracking";
import { PatientFeedback } from "~/app/core/modals/feedback";

export class FeedbackTracker extends TraceableTask {
    constructor(private store: FeedbackTracking = feedbackTracking) {
        super("trackFeedbackAcquisition");
    }

    protected async onTracedRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void> {
        const feedback = invocationEvent.data as PatientFeedback;

        await this.store.track(feedback.feedbackId);
    }
}
