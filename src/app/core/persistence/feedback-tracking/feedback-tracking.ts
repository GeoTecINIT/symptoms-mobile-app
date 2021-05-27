import { EMAIStore } from "@geotecinit/emai-framework/storage";
import { TrackedFeedback } from "~/app/core/persistence/feedback-tracking/tracked-feedback";

export interface FeedbackTracking {
    track(feedbackId: string): Promise<void>;
    getCount(feedbackId: string): Promise<number>;
    clear(): Promise<void>;
}

const DOC_TYPE = "tracked-feedback";

class FeedbackTrackingDB implements FeedbackTracking {
    private readonly store: EMAIStore<TrackedFeedback>;

    constructor() {
        this.store = new EMAIStore<TrackedFeedback>(
            DOC_TYPE,
            docFrom,
            trackedFeedbackFrom
        );
    }

    async track(feedbackId: string): Promise<void> {
        const possibleExisting = await this.store.get(feedbackId);
        if (possibleExisting) {
            await this.store.update(feedbackId, {
                count: possibleExisting.count + 1,
            });
        } else {
            const trackedFeedback: TrackedFeedback = {
                id: feedbackId,
                count: 1,
            };
            await this.store.create(trackedFeedback, feedbackId);
        }
    }

    async getCount(feedbackId: string): Promise<number> {
        const possibleExisting = await this.store.get(feedbackId);

        return possibleExisting ? possibleExisting.count : 0;
    }

    clear(): Promise<void> {
        return this.store.clear();
    }
}

export const feedbackTracking = new FeedbackTrackingDB();

function docFrom(trackedFeedback: TrackedFeedback): any {
    return {
        ...trackedFeedback,
    };
}

function trackedFeedbackFrom(doc: any): TrackedFeedback {
    const { id, count } = doc;

    return {
        id,
        count,
    };
}
