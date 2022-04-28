import { ExposuresStore } from "~/app/core/persistence/exposures";
import { ExposureDropoutChecker } from "~/app/tasks/exposure/escapes/exposure-dropout-checker";
import {
    createExposuresStoreMock,
    createFakeAoI,
    createFakeAoIProximityChange,
    createNewFakeExposure,
} from "~/tests/tasks/exposure";
import {
    createEvent,
    listenToEventTrigger,
} from "@awarns/core/testing/events";

describe("Exposure dropout checker task", () => {
    let storeMock: ExposuresStore;
    let task: ExposureDropoutChecker;

    const aoiChange1 = createFakeAoIProximityChange(createFakeAoI("AoI1"));
    const aoiChange2 = createFakeAoIProximityChange(createFakeAoI("AoI2"));

    beforeEach(() => {
        storeMock = createExposuresStoreMock();
        task = new ExposureDropoutChecker(storeMock);
    });

    it("does nothing when no exposure is ongoing", async () => {
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(null)
        );

        const invocationEvent = createEvent("triggerEvent", {
            data: [aoiChange1],
        });

        const done = listenToEventTrigger(
            "checkExposureDropoutFinished",
            invocationEvent.id
        );

        task.run({}, invocationEvent);

        await done;
    });

    it("does nothing when the exposure area is not part of the proximity changes", async () => {
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(createNewFakeExposure(aoiChange1.aoi))
        );

        const invocationEvent = createEvent("triggerEvent", {
            data: [aoiChange2],
        });

        const done = listenToEventTrigger(
            "checkExposureDropoutFinished",
            invocationEvent.id
        );

        task.run({}, invocationEvent);

        await done;
    });

    it("informs about exposure dropout when the exposure area is present in the received proximity changes", async () => {
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(createNewFakeExposure(aoiChange1.aoi))
        );

        const invocationEvent = createEvent("triggerEvent", {
            data: [aoiChange1],
        });

        const done = listenToEventTrigger(
            "exposureDroppedOut",
            invocationEvent.id
        );

        task.run({}, invocationEvent);

        await done;
    });
});
