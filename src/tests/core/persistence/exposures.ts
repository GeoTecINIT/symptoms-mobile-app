import { Exposure, exposures } from "~/app/core/persistence/exposures";
import { AreaOfInterest } from "@geotecinit/emai-framework/entities/aois";

describe("Exposures store", () => {
    const place: AreaOfInterest = {
        id: "place1",
        name: "Place 1",
        longitude: 0,
        latitude: 0,
        radius: 30,
    };

    const newPreExposure: Exposure = {
        place,
        emotionValues: [],
        successful: false,
    };

    const newExposure: Exposure = {
        startTime: new Date(2021, 4, 20, 18, 0),
        place,
        emotionValues: [],
        successful: false,
    };

    const finishedExposure: Exposure = {
        startTime: new Date(2021, 4, 20, 16, 0),
        endTime: new Date(2021, 4, 20, 17, 0),
        place,
        emotionValues: [
            { timestamp: new Date(2021, 4, 20, 16, 5), value: 2 },
            { timestamp: new Date(2021, 4, 20, 16, 5), value: 2 },
            { timestamp: new Date(2021, 4, 20, 16, 5), value: 4 },
            { timestamp: new Date(2021, 4, 20, 16, 5), value: 7 },
            { timestamp: new Date(2021, 4, 20, 16, 5), value: 8 },
            { timestamp: new Date(2021, 4, 20, 16, 5), value: 7 },
            { timestamp: new Date(2021, 4, 20, 16, 5), value: 6 },
            { timestamp: new Date(2021, 4, 20, 16, 5), value: 5 },
            { timestamp: new Date(2021, 4, 20, 16, 5), value: 6 },
            { timestamp: new Date(2021, 4, 20, 16, 5), value: 5 },
            { timestamp: new Date(2021, 4, 20, 16, 5), value: 5 },
        ],
        successful: true,
    };

    beforeAll(async () => {
        await exposures.clear();
    });

    it("successfully inserts a new pre-exposure", async () => {
        const id = await exposures.insert(newPreExposure);
        expect(id).toEqual(jasmine.any(String));
    });

    it("successfully inserts a new exposure", async () => {
        const id = await exposures.insert(newExposure);
        expect(id).toEqual(jasmine.any(String));
    });

    it("successfully gets the last unfinished exposure", async () => {
        await exposures.insert(newExposure);
        const lastExposure = await exposures.getLastUnfinished();
        expect(lastExposure).toEqual(jasmine.objectContaining(newExposure));
    });

    it("successfully gets the last pre-exposure", async () => {
        await exposures.insert(newPreExposure);
        const lastExposure = await exposures.getLastUnfinished();
        expect(lastExposure).toEqual(jasmine.objectContaining(newPreExposure));
    });

    it("returns null when no exposure is ongoing", async () => {
        await exposures.insert(finishedExposure);
        const lastExposure = await exposures.getLastUnfinished();
        expect(lastExposure).toBeNull();
    });

    it("is able to update a previously created exposure", async () => {
        await exposures.insert(newExposure);
        const exposureToUpdate = await exposures.getLastUnfinished();
        const updatedExposure: Exposure = {
            ...exposureToUpdate,
            emotionValues: [
                ...newExposure.emotionValues,
                {
                    timestamp: new Date(2021, 4, 20, 18, 5),
                    value: 5,
                },
            ],
            successful: true,
        };
        await exposures.update(updatedExposure);
        const lastExposure = await exposures.getLastUnfinished();
        expect(lastExposure).toEqual(updatedExposure);
    });

    it("cannot update an exposure that has not been previously created", async () => {
        await expectAsync(exposures.update(newExposure)).toBeRejected();
    });

    it("is able to recover all previously-stored exposures", async () => {
        await exposures.insert(finishedExposure);
        await exposures.insert(newExposure);

        const allExposures = await exposures.getAll();
        expect(allExposures.length).toBe(2);
        expect(allExposures[0]).toEqual(
            jasmine.objectContaining(finishedExposure)
        );
        expect(allExposures[1]).toEqual(jasmine.objectContaining(newExposure));
    });

    afterEach(async () => {
        await exposures.clear();
    });
});
