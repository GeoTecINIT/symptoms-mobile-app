import { Exposure, ExposuresStore } from "~/app/core/persistence/exposures";
import {
    AoIProximityChange,
    AreaOfInterest,
    GeofencingProximity,
} from "@geotecinit/emai-framework/entities/aois";
import { Change } from "@geotecinit/emai-framework/entities";

export function createExposuresStoreMock(): ExposuresStore {
    return {
        insert(exposure: Exposure): Promise<string> {
            return Promise.resolve("");
        },
        getLastUnfinished(andStarted?: boolean): Promise<Exposure> {
            return Promise.resolve(undefined);
        },
        update(exposure: Exposure): Promise<void> {
            return Promise.resolve(undefined);
        },
        getAll(): Promise<Array<Exposure>> {
            return Promise.resolve(undefined);
        },
        remove(id: string): Promise<void> {
            return Promise.resolve();
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

export function createFakeAoIProximityChange(
    aoi: AreaOfInterest,
    proximity: GeofencingProximity = GeofencingProximity.INSIDE,
    change: Change = Change.START
): AoIProximityChange {
    return new AoIProximityChange(aoi, proximity, change);
}

export function createNewFakeExposure(place: AreaOfInterest): Exposure {
    return {
        startTime: new Date(),
        place,
        emotionValues: [],
        successful: false,
    };
}
