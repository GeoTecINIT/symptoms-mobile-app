import {
    EmotionValue,
    Exposure,
    ExposuresStore,
} from "~/app/core/persistence/exposures";
import {
    AoIProximityChange,
    AreaOfInterest,
    GeofencingProximity,
} from "@awarns/core/entities/aois";
import { Change } from "@awarns/core/entities";

export function createExposuresStoreMock(): ExposuresStore {
    return {
        insert(_exposure: Exposure): Promise<string> {
            return Promise.resolve("");
        },
        getLastUnfinished(_andStarted?: boolean): Promise<Exposure> {
            return Promise.resolve(undefined);
        },
        update(_exposure: Exposure): Promise<void> {
            return Promise.resolve(undefined);
        },
        getAll(): Promise<Array<Exposure>> {
            return Promise.resolve(undefined);
        },
        remove(_id: string): Promise<void> {
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

export function createNewFakeExposure(
    place: AreaOfInterest,
    started = true,
    emotionValues: Array<number> = []
): Exposure {
    const values: Array<EmotionValue> = emotionValues.map((value, index) => ({
        timestamp: new Date(
            Date.now() - (emotionValues.length - index - 1) * 8 * 60 * 1000
        ),
        value,
    }));

    const exposure: Exposure = {
        place,
        emotionValues: values,
        successful: false,
    };

    if (started) {
        exposure.startTime = new Date();
    }

    return exposure;
}
