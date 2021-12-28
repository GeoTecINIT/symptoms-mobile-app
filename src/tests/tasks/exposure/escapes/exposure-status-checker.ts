import { ExposuresStore } from "~/app/core/persistence/exposures";
import { ExposureStatusChecker } from "~/app/tasks/exposure/escapes/exposure-status-checker";
import {
    createExposuresStoreMock,
    createFakeAoI,
    createFakeAoIProximityChange,
    createNewFakeExposure,
} from "~/tests/tasks/exposure";
import {
    createEvent,
    listenToEventTrigger,
} from "@geotecinit/emai-framework/testing/events";

describe("Exposure status checker task", () => {
    let storeMock: ExposuresStore;
    let task: ExposureStatusChecker;

    const aoiChange1 = createFakeAoIProximityChange(createFakeAoI("AoI1"));

    beforeEach(() => {
        storeMock = createExposuresStoreMock();
        task = new ExposureStatusChecker(storeMock);
    });

    it("says that no exposure is ongoing when that is the case", async () => {
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(null)
        );

        const invocationEvent = createEvent("triggerEvent", {
            data: [aoiChange1],
        });

        const resultPromise = listenToEventTrigger(
            "enteredAreaWithNoOngoingExposure",
            invocationEvent.id
        );

        task.run({}, invocationEvent);

        const result = await resultPromise;
        expect(result).toEqual(
            invocationEvent.data.map((change) => ({ ...change }))
        );
    });

    it("says that a pre-exposure is ongoing whe it is in the same visited area", async () => {
        const preExposure = createNewFakeExposure(aoiChange1.aoi);
        preExposure.startTime = undefined;
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(preExposure)
        );

        const invocationEvent = createEvent("triggerEvent", {
            data: [aoiChange1],
        });

        const resultPromise = listenToEventTrigger(
            "enteredAreaWithPreStartedExposure",
            invocationEvent.id
        );

        task.run({}, invocationEvent);

        const result = await resultPromise;
        expect(result).toEqual(
            invocationEvent.data.map((change) => ({ ...change }))
        );
    });

    it("says that an exposure is ongoing when it is in the same visited area", async () => {
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(createNewFakeExposure(aoiChange1.aoi))
        );

        const invocationEvent = createEvent("triggerEvent", {
            data: [aoiChange1],
        });

        const resultPromise = listenToEventTrigger(
            "enteredAreaWithOngoingExposure",
            invocationEvent.id
        );

        task.run({}, invocationEvent);

        const result = await resultPromise;
        expect(result).toEqual(
            invocationEvent.data.map((change) => ({ ...change }))
        );
    });
});
