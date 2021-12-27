import { ExposuresStore } from "~/app/core/persistence/exposures";
import { PreStartExposureTask } from "~/app/tasks/exposure/pre-start-exposure";
import { ExposureChange } from "~/app/tasks/exposure";
import {
    createExposuresStoreMock,
    createFakeAoI,
    createFakeAoIProximityChange,
} from "./index";
import {
    createEvent,
    listenToEventTrigger,
} from "@geotecinit/emai-framework/testing/events";
import { Change } from "@geotecinit/emai-framework/internal/providers";
import { GeofencingProximity } from "@geotecinit/emai-framework/internal/tasks/geofencing/geofencing-state";

describe("Pre-start exposure task", () => {
    let storeMock: ExposuresStore;
    let task: PreStartExposureTask;

    beforeEach(() => {
        storeMock = createExposuresStoreMock();
        task = new PreStartExposureTask(storeMock);
        spyOn(storeMock, "insert");
    });

    it("pre-starts a new exposure when no other exposure is ongoing", async () => {
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(null)
        );

        const aoi = createFakeAoI("AoI1");
        const invocationEvent = createEvent("eventTrigger", {
            data: [
                createFakeAoIProximityChange(aoi, GeofencingProximity.NEARBY),
            ],
        });

        const resultPromise = listenToEventTrigger(
            "preExposureStarted",
            invocationEvent.id
        );

        task.run({}, invocationEvent);

        const result = (await resultPromise) as ExposureChange;
        expect(storeMock.insert).toHaveBeenCalled();
        expect(result).toEqual(
            jasmine.objectContaining({
                type: "pre-exposure-started",
                change: Change.NONE,
                place: aoi,
            })
        );
        expect(result.timestamp).toEqual(jasmine.any(Date));
    });
});
