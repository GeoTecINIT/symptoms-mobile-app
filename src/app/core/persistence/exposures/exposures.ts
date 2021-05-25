import { Exposure } from "./exposure";
import { EMAIStore } from "@geotecinit/emai-framework/storage";

export interface ExposuresStore {
    insert(exposure: Exposure): Promise<string>;
    getLastUnfinished(): Promise<Exposure>;
    update(exposure: Exposure): Promise<void>;
    getAll(): Promise<Array<Exposure>>;
    clear(): Promise<void>;
}

const DOC_TYPE = "exposure";

class ExposuresStoreDB implements ExposuresStore {
    private readonly store: EMAIStore<Exposure>;

    constructor() {
        this.store = new EMAIStore<Exposure>(DOC_TYPE, docFrom, exposureFrom);
    }

    insert(exposure: Exposure): Promise<string> {
        return this.store.create(exposure);
    }

    async update(exposure: Exposure): Promise<void> {
        if (!exposure.id) {
            throw new Error(
                "Cannot update an exposure not previously inserted! (missing id)"
            );
        }
        const { endTime, emotionValues } = docFrom(exposure);
        await this.store.update(exposure.id, {
            endTime,
            emotionValues,
        });
    }

    getAll(): Promise<Array<Exposure>> {
        return this.store.fetch({
            select: [],
            order: [{ property: "startTime", direction: "asc" }],
        });
    }

    async getLastUnfinished(): Promise<Exposure> {
        const unfinished = await this.store.fetch({
            select: [],
            where: [{ property: "endTime", comparison: "equalTo", value: -1 }],
            order: [{ property: "startTime", direction: "desc" }],
        });

        if (unfinished.length === 0) {
            return null;
        }

        return unfinished[0];
    }

    async clear(): Promise<void> {
        await this.store.clear();
    }
}

export const exposures = new ExposuresStoreDB();

function docFrom(exposure: Exposure): any {
    const { startTime, endTime, emotionValues, place } = exposure;

    return {
        startTime: startTime.getTime(),
        endTime: endTime ? endTime.getTime() : -1,
        emotionValues: [
            ...emotionValues.map((value) => ({
                timestamp: value.timestamp.getTime(),
                value: value.value,
            })),
        ],
        place,
    };
}

function exposureFrom(doc: any): Exposure {
    const { id, startTime, endTime, emotionValues, place } = doc;

    return {
        id,
        startTime: new Date(startTime),
        endTime: endTime !== -1 ? new Date(endTime) : null,
        emotionValues: [
            ...emotionValues.map((value) => ({
                timestamp: new Date(value.timestamp),
                value: value.value,
            })),
        ],
        place,
    };
}
