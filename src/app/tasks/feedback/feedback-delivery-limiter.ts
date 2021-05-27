import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@geotecinit/emai-framework/tasks";
import {
    feedbackTracking,
    FeedbackTracking,
} from "~/app/core/persistence/feedback-tracking";

const CAN_DELIVER = "canDeliverFeedback";
const CANNOT_DELIVER = "cannotDeliverFeedback";

export class FeedbackDeliveryLimiter extends TraceableTask {
    constructor(private store: FeedbackTracking = feedbackTracking) {
        super("limitedFeedbackDelivery", {
            outputEventNames: [CAN_DELIVER, CANNOT_DELIVER],
        });
    }

    protected async onTracedRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const { feedbackId, maxCount } = taskParams;
        if (!feedbackId || !maxCount) {
            throw new Error(
                "Both 'feedbackId' and 'maxCount' params are required"
            );
        }

        const count = await this.store.getCount(feedbackId);
        if (count >= maxCount) {
            return { eventName: CANNOT_DELIVER, result: feedbackId };
        } else {
            return { eventName: CAN_DELIVER, result: feedbackId };
        }
    }
}
