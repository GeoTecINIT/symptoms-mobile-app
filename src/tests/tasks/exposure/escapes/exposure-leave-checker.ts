import { ExposuresStore } from "~/app/core/persistence/exposures";
import {
    createExposuresStoreMock,
    createFakeAoI,
    createNewFakeExposure,
} from "~/tests/tasks/exposure";

import {
    createEvent,
    listenToEventTrigger,
} from "@geotecinit/emai-framework/testing/events";
import { ExposureLeaveChecker } from "~/app/tasks/exposure/escapes/exposure-leave-checker";
import { ExposureAreaLeftRecord } from "~/app/tasks/exposure/escapes/exposure-area-left";
import { Change } from "@geotecinit/emai-framework/internal/providers";

describe("Exposure leave checker task", () => {
    let storeMock: ExposuresStore;
    let task: ExposureLeaveChecker;

    const aoi1 = createFakeAoI("AoI1");
    const aoi2 = createFakeAoI("AoI2");

    beforeEach(() => {
        storeMock = createExposuresStoreMock();
        task = new ExposureLeaveChecker(storeMock);
    });

    it("does nothing when no exposure is ongoing", async () => {
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(null)
        );

        const invocationEvent = createEvent("triggerEvent", {
            data: [aoi1, aoi2],
        });

        const done = listenToEventTrigger(
            "checkExposureAreaLeftFinished",
            invocationEvent.id
        );

        task.run({}, invocationEvent);

        await done;
    });

    it("does nothing when the triggering event does not belong to the exposure area", async () => {
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(createNewFakeExposure(aoi1))
        );

        const invocationEvent = createEvent("triggerEvent", {
            data: [aoi2],
        });

        const done = listenToEventTrigger(
            "checkExposureAreaLeftFinished",
            invocationEvent.id
        );

        task.run({}, invocationEvent);

        await done;
    });

    it("produces an exposure left record when the current exposure area is present in the invocation event", async () => {
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(createNewFakeExposure(aoi1))
        );

        const invocationEvent = createEvent("triggerEvent", {
            data: [aoi1],
        });

        const pendingResult = listenToEventTrigger(
            "exposureAreaLeft",
            invocationEvent.id
        );

        task.run({}, invocationEvent);

        const result = (await pendingResult) as ExposureAreaLeftRecord;
        expect(result).toEqual(
            jasmine.objectContaining({
                type: "exposure-area-left",
                place: aoi1,
                change: Change.START,
            })
        );
    });
});
