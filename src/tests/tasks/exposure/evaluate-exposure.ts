import { Exposure, ExposuresStore } from "~/app/core/persistence/exposures";
import { EvaluateExposureTask } from "~/app/tasks/exposure/evaluate-exposure";
import {
    createExposuresStoreMock,
    createFakeAoI,
} from "~/tests/tasks/exposure/index";
import {
    createEvent,
    listenToEventTrigger,
} from "@geotecinit/emai-framework/testing/events";

const MILD_ANXIETY = 5;
const GOOD_PEAK_DIFF = 3;

describe("Evaluate exposure task", () => {
    let storeMock: ExposuresStore;
    let task: EvaluateExposureTask;

    const taskParams = {
        emotionThreshold: MILD_ANXIETY,
        peakToLastThreshold: GOOD_PEAK_DIFF,
    };

    const ongoingExposure: Exposure = {
        id: "exposure-1",
        startTime: new Date(Date.now() - 60 * 60 * 1000 /* 1h ago */),
        place: createFakeAoI("AoI1"),
        emotionValues: [],
        successful: false,
    };
    const testEmotionValues = [
        { value: 3, timestamp: new Date() },
        { value: 4, timestamp: new Date() },
        { value: 5, timestamp: new Date() },
        { value: 6, timestamp: new Date() },
        { value: 7, timestamp: new Date() },
        { value: 8, timestamp: new Date() },
        { value: 7, timestamp: new Date() },
        { value: 8, timestamp: new Date() },
        { value: 7, timestamp: new Date() },
        { value: 6, timestamp: new Date() },
        { value: 5, timestamp: new Date() },
        { value: 4, timestamp: new Date() },
    ];

    beforeEach(() => {
        storeMock = createExposuresStoreMock();
        task = new EvaluateExposureTask(storeMock);
    });

    it("evaluate the exposure as successful when last emotion value is under threshold", async () => {
        ongoingExposure.emotionValues = [
            ...testEmotionValues,
            {
                value: 4,
                timestamp: new Date(),
            },
        ];
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(ongoingExposure)
        );

        const invocationEvent = createEvent("eventTrigger");

        const done = listenToEventTrigger(
            "exposureEvaluationResultedSuccessful",
            invocationEvent.id
        );

        task.run(taskParams, invocationEvent);

        await done;
    });

    it("evaluate the exposure as neutral when last emotion value is above threshold but effort is good enough", async () => {
        ongoingExposure.emotionValues = [
            ...testEmotionValues,
            {
                value: 5,
                timestamp: new Date(),
            },
        ];
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(ongoingExposure)
        );

        const invocationEvent = createEvent("eventTrigger");

        const done = listenToEventTrigger(
            "exposureEvaluationResultedNeutral",
            invocationEvent.id
        );

        task.run(taskParams, invocationEvent);

        await done;
    });

    it("results unsuccessful otherwise", async () => {
        ongoingExposure.emotionValues = [
            ...testEmotionValues,
            {
                value: 6,
                timestamp: new Date(),
            },
        ];
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(ongoingExposure)
        );

        const invocationEvent = createEvent("eventTrigger");

        const done = listenToEventTrigger(
            "exposureEvaluationResultedUnsuccessful",
            invocationEvent.id
        );

        task.run(taskParams, invocationEvent);

        await done;
    });

    it("results unsuccessful when there are not enough emotion values", async () => {
        ongoingExposure.emotionValues = [];
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(ongoingExposure)
        );

        const invocationEvent = createEvent("eventTrigger");

        const done = listenToEventTrigger(
            "exposureEvaluationResultedUnsuccessful",
            invocationEvent.id
        );

        task.run(taskParams, invocationEvent);

        await done;
    });
});
