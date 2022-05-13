import { Exposure, ExposuresStore } from "~/app/core/persistence/exposures";
import { CancelPreExposureTask } from "~/app/tasks/exposure/cancel-pre-exposure";
import { ExposureChange } from "~/app/tasks/exposure";
import {
    createExposuresStoreMock,
    createFakeAoI,
    createFakeAoIProximityChange,
} from "./index";
import { createEvent, listenToEventTrigger } from "@awarns/core/testing/events";
import { Change } from "@awarns/core/entities";
import { GeofencingProximity } from "@awarns/geofencing";

describe("Cancel pre-exposure task", () => {
    let storeMock: ExposuresStore;
    let task: CancelPreExposureTask;

    const preStartedExposure: Exposure = {
        id: "exposure-1",
        place: createFakeAoI("AoI1"),
        emotionValues: [],
        successful: false,
    };

    beforeEach(() => {
        storeMock = createExposuresStoreMock();
        task = new CancelPreExposureTask(storeMock);
        spyOn(storeMock, "remove");
    });

    it("cancels a pre-started exposure", async () => {
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(preStartedExposure)
        );

        const aoi = createFakeAoI("AoI1");
        const invocationEvent = createEvent("eventTrigger", {
            data: [
                createFakeAoIProximityChange(aoi, GeofencingProximity.NEARBY),
            ],
        });

        const resultPromise = listenToEventTrigger(
            "preExposureCancelled",
            invocationEvent.id
        );

        task.run({}, invocationEvent);

        const result = (await resultPromise) as ExposureChange;
        expect(storeMock.remove).toHaveBeenCalled();
        expect(result).toEqual(
            jasmine.objectContaining({
                type: "pre-exposure-cancelled",
                change: Change.NONE,
                place: aoi,
            })
        );
        expect(result.timestamp).toEqual(jasmine.any(Date));
    });
});
