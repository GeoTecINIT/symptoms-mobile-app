import { Exposure, ExposuresStore } from "~/app/core/persistence/exposures";
import { EvaluateExposureExtensionTask } from "~/app/tasks/exposure/evaluate-exposure-ext";
import {
    createExposuresStoreMock,
    createFakeAoI,
} from "~/tests/tasks/exposure/index";
import {
    createEvent,
    listenToEventTrigger,
} from "@geotecinit/emai-framework/testing/events";

const SEVERE_ANXIETY = 8;

describe("Evaluate exposure task", () => {
    let storeMock: ExposuresStore;
    let task: EvaluateExposureExtensionTask;

    const taskParams = { emotionThreshold: SEVERE_ANXIETY };

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
        { value: 9, timestamp: new Date() },
        { value: 8, timestamp: new Date() },
        { value: 9, timestamp: new Date() },
        { value: 8, timestamp: new Date() },
        { value: 9, timestamp: new Date() },
        { value: 8, timestamp: new Date() },
    ];

    beforeEach(() => {
        storeMock = createExposuresStoreMock();
        task = new EvaluateExposureExtensionTask(storeMock);
    });

    it("evaluate the exposure as successful when last emotion value is under threshold", async () => {
        ongoingExposure.emotionValues = [
            ...testEmotionValues,
            {
                value: 7,
                timestamp: new Date(),
            },
        ];
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(ongoingExposure)
        );

        const invocationEvent = createEvent("eventTrigger");

        const done = listenToEventTrigger(
            "exposureExtensionEvaluationResultedSuccessful",
            invocationEvent.id
        );

        task.run(taskParams, invocationEvent);

        await done;
    });

    it("results unsuccessful otherwise", async () => {
        ongoingExposure.emotionValues = [
            ...testEmotionValues,
            {
                value: 8,
                timestamp: new Date(),
            },
        ];
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(ongoingExposure)
        );

        const invocationEvent = createEvent("eventTrigger");

        const done = listenToEventTrigger(
            "exposureExtensionEvaluationResultedUnsuccessful",
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
            "exposureExtensionEvaluationResultedUnsuccessful",
            invocationEvent.id
        );

        task.run(taskParams, invocationEvent);

        await done;
    });
});
