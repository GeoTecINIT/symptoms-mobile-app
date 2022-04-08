import { feedbackTracking } from "~/app/core/persistence/feedback-tracking";

describe("Feedback tracking strore", () => {
    const store = feedbackTracking;
    const exampleFeedbackId = "f1";

    it("allows to track a feedback as acquired", async () => {
        await store.track(exampleFeedbackId);
        const count = await store.getCount(exampleFeedbackId);
        expect(count).toBe(1);
    });

    it("increments the count of an already tracked feedback", async () => {
        await store.track(exampleFeedbackId);
        await store.track(exampleFeedbackId);
        const count = await store.getCount(exampleFeedbackId);
        expect(count).toBe(2);
    });

    it("returns a count of 0 when feedback has not been tracked yet", async () => {
        const count = await store.getCount(exampleFeedbackId);
        expect(count).toBe(0);
    });

    afterEach(async () => {
        await feedbackTracking.clear();
    });
});
