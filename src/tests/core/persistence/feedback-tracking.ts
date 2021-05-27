import { feedbackTracking } from "~/app/core/persistence/feedback-tracking";
import { PatientFeedback } from "~/app/core/modals/feedback";

describe("Feedback tracking strore", () => {
    const store = feedbackTracking;
    const exampleFeedback = new PatientFeedback("f1", "Feedback?", "Feedback");

    it("allows to track a feedback as acquired", async () => {
        await store.track(exampleFeedback);
        const count = await store.getCount(exampleFeedback);
        expect(count).toBe(1);
    });

    it("increments the count of an already tracked feedback", async () => {
        await store.track(exampleFeedback);
        await store.track(exampleFeedback);
        const count = await store.getCount(exampleFeedback);
        expect(count).toBe(2);
    });

    it("returns a count of 0 when feedback has not been tracked yet", async () => {
        const count = await store.getCount(exampleFeedback);
        expect(count).toBe(0);
    });

    afterEach(async () => {
        await feedbackTracking.clear();
    });
});
