import { ExposuresStore } from "~/app/core/persistence/exposures";
import { ExposureChange } from "~/app/tasks/exposure";
import { FinishExposureTask } from "~/app/tasks/exposure/finish-exposure";
import {
    createExposuresStoreMock,
    createFakeAoI,
} from "~/tests/tasks/exposure/index";
import {
    createEvent,
    listenToEventTrigger,
} from "@geotecinit/emai-framework/testing/events";
import { Change } from "@geotecinit/emai-framework/internal/providers";

describe("Finish exposure task", () => {
    let storeMock: ExposuresStore;
    let task: FinishExposureTask;

    const ongoingExposure = {
        id: "exposure-1",
        startTime: new Date(Date.now() - 60 * 60 * 1000 /* 1h ago */),
        place: createFakeAoI("AoI1"),
        emotionValues: [],
        successful: false,
    };

    beforeEach(() => {
        storeMock = createExposuresStoreMock();
        task = new FinishExposureTask(storeMock);
        spyOn(storeMock, "update");
    });

    it("finishes an ongoing exposure as unsuccessful when no parameter is passed", async () => {
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(ongoingExposure)
        );

        const invocationEvent = createEvent("eventTrigger");

        const resultPromise = listenToEventTrigger(
            "exposureFinished",
            invocationEvent.id
        );

        task.run({}, invocationEvent);

        const result = (await resultPromise) as ExposureChange;
        expect(storeMock.update).toHaveBeenCalled();
        expect(result).toEqual(
            jasmine.objectContaining({
                type: "exposure-change",
                change: Change.END,
                place: ongoingExposure.place,
                emotionValues: ongoingExposure.emotionValues,
                successful: false,
            })
        );
        expect(result.timestamp).toEqual(jasmine.any(Date));
    });

    it("finishes an ongoing exposure as successful when parameter is passed", async () => {
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(ongoingExposure)
        );

        const invocationEvent = createEvent("eventTrigger");

        const resultPromise = listenToEventTrigger(
            "exposureFinished",
            invocationEvent.id
        );

        task.run({ successful: true }, invocationEvent);

        const result = (await resultPromise) as ExposureChange;
        expect(result).toEqual(
            jasmine.objectContaining({
                successful: true,
            })
        );
    });
});
