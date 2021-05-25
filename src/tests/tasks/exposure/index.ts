import { Exposure, ExposuresStore } from "~/app/core/persistence/exposures";
import { AreaOfInterest } from "@geotecinit/emai-framework/entities/aois";

export function createExposuresStoreMock(): ExposuresStore {
    return {
        insert(exposure: Exposure): Promise<string> {
            return Promise.resolve("");
        },
        getLastUnfinished(): Promise<Exposure> {
            return Promise.resolve(undefined);
        },
        update(exposure: Exposure): Promise<void> {
            return Promise.resolve(undefined);
        },
        getAll(): Promise<Array<Exposure>> {
            return Promise.resolve(undefined);
        },
        clear(): Promise<void> {
            return Promise.resolve(undefined);
        },
    };
}

export function createFakeAoI(name: string): AreaOfInterest {
    return {
        id: name.toLowerCase(),
        name,
        latitude: 0,
        longitude: 0,
        radius: 0,
    };
}

export function createNewFakeExposure(place: AreaOfInterest): Exposure {
    return {
        startTime: new Date(),
        endTime: null,
        place,
        emotionValues: [],
    };
}
