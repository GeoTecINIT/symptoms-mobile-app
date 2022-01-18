import { ExposuresStore } from "~/app/core/persistence/exposures";
import { StartExposureTask } from "~/app/tasks/exposure/start-exposure";
import { ExposureChange } from "~/app/tasks/exposure";
import {
    createExposuresStoreMock,
    createFakeAoI,
    createFakeAoIProximityChange,
    createNewFakeExposure,
} from "./index";
import {
    createEvent,
    listenToEventTrigger,
} from "@geotecinit/emai-framework/testing/events";
import { Change } from "@geotecinit/emai-framework/internal/providers";

describe("Start exposure task", () => {
    let storeMock: ExposuresStore;
    let task: StartExposureTask;

    const aoiChange1 = createFakeAoIProximityChange(createFakeAoI("AoI1"));

    beforeEach(() => {
        storeMock = createExposuresStoreMock();
        task = new StartExposureTask(storeMock);
        spyOn(storeMock, "insert");
        spyOn(storeMock, "update");
    });

    it("begins a new exposure when no other exposure is ongoing", async () => {
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(null)
        );

        const invocationEvent = createEvent("eventTrigger", {
            data: [aoiChange1],
        });

        const resultPromise = listenToEventTrigger(
            "exposureStarted",
            invocationEvent.id
        );

        task.run({}, invocationEvent);

        const result = (await resultPromise) as ExposureChange;
        expect(storeMock.insert).toHaveBeenCalled();
        expect(result).toEqual(
            jasmine.objectContaining({
                type: "exposure-change",
                change: Change.START,
                place: aoiChange1.aoi,
                emotionValues: [],
                successful: false,
            })
        );
        expect(result.timestamp).toEqual(jasmine.any(Date));
    });

    it("begins a new exposure when it was already pre-started", async () => {
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(createNewFakeExposure(aoiChange1.aoi, false))
        );

        const invocationEvent = createEvent("eventTrigger", {
            data: [aoiChange1],
        });

        const resultPromise = listenToEventTrigger(
            "exposureStarted",
            invocationEvent.id
        );

        task.run({}, invocationEvent);

        const result = (await resultPromise) as ExposureChange;
        expect(storeMock.insert).not.toHaveBeenCalled();
        expect(storeMock.update).toHaveBeenCalled();
        expect(result).toEqual(
            jasmine.objectContaining({
                type: "exposure-change",
                change: Change.START,
                place: aoiChange1.aoi,
                emotionValues: [],
                successful: false,
            })
        );
        expect(result.timestamp).toEqual(jasmine.any(Date));
    });
});
