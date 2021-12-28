import { ExposuresStore } from "~/app/core/persistence/exposures";
import { PreExposureStatusChecker } from "~/app/tasks/exposure/escapes/pre-exposure-status-checker";
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
import { GeofencingProximity } from "@geotecinit/emai-framework/internal/tasks/geofencing/geofencing-state";

describe("Pre exposure status checker task", () => {
    let storeMock: ExposuresStore;
    let task: PreExposureStatusChecker;

    const aoiChange1 = createFakeAoIProximityChange(
        createFakeAoI("AoI1"),
        GeofencingProximity.NEARBY
    );

    beforeEach(() => {
        storeMock = createExposuresStoreMock();
        task = new PreExposureStatusChecker(storeMock);
    });

    it("says that no exposure is ongoing when that is the case", async () => {
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(null)
        );

        const invocationEvent = createEvent("triggerEvent", {
            data: [aoiChange1],
        });

        const resultPromise = listenToEventTrigger(
            "approachedAreaWithNoOngoingExposure",
            invocationEvent.id
        );

        task.run({}, invocationEvent);

        const result = await resultPromise;
        expect(result).toEqual(
            invocationEvent.data.map((change) => ({ ...change }))
        );
    });

    it("says that an exposure is ongoing when it is nearby the same visited area", async () => {
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(createNewFakeExposure(aoiChange1.aoi))
        );

        const invocationEvent = createEvent("triggerEvent", {
            data: [aoiChange1],
        });

        const resultPromise = listenToEventTrigger(
            "approachedAreaWithOngoingExposure",
            invocationEvent.id
        );

        task.run({}, invocationEvent);

        const result = await resultPromise;
        expect(result).toEqual(
            invocationEvent.data.map((change) => ({ ...change }))
        );
    });

    it("says that an exposure is ongoing when a pre-exposure is ongoing in the visited area", async () => {
        const preExposure = createNewFakeExposure(aoiChange1.aoi);
        preExposure.startTime = undefined;
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(preExposure)
        );

        const invocationEvent = createEvent("triggerEvent", {
            data: [aoiChange1],
        });

        const resultPromise = listenToEventTrigger(
            "approachedAreaWithOngoingExposure",
            invocationEvent.id
        );

        task.run({}, invocationEvent);

        const result = await resultPromise;
        expect(result).toEqual(
            invocationEvent.data.map((change) => ({ ...change }))
        );
    });
});
