import { ExposuresStore } from "~/app/core/persistence/exposures";
import { StartExposureTask } from "~/app/tasks/exposure/start-exposure";
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

describe("Start exposure task", () => {
    let storeMock: ExposuresStore;
    let task: StartExposureTask;

    beforeEach(() => {
        storeMock = createExposuresStoreMock();
        task = new StartExposureTask(storeMock);
        spyOn(storeMock, "insert");
    });

    it("begins a new exposure when no other exposure is ongoing", async () => {
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(null)
        );

        const aoi = createFakeAoI("AoI1");
        const invocationEvent = createEvent("eventTrigger", {
            data: [createFakeAoIProximityChange(aoi)],
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
                place: aoi,
                emotionValues: [],
                successful: false,
            })
        );
        expect(result.timestamp).toEqual(jasmine.any(Date));
    });
});
