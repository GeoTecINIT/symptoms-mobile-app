import { Exposure } from "./exposure";
import { EMAIStore } from "@geotecinit/emai-framework/storage";
import { QueryLogicalOperator } from "nativescript-couchbase-plugin";

export interface ExposuresStore {
    insert(exposure: Exposure): Promise<string>;
    getLastUnfinished(andStarted?: boolean): Promise<Exposure>;
    update(exposure: Exposure): Promise<void>;
    getAll(): Promise<Array<Exposure>>;
    remove(id: string): Promise<void>;
    clear(): Promise<void>;
}

const DOC_TYPE = "exposure";

class ExposuresStoreDB implements ExposuresStore {
    get changes() {
        return this.store.changes;
    }

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
        const { startTime, endTime, emotionValues, successful } = docFrom(
            exposure
        );
        await this.store.update(exposure.id, {
            startTime,
            endTime,
            emotionValues,
            successful,
        });
    }

    getAll(): Promise<Array<Exposure>> {
        return this.store.fetch({
            select: [],
            order: [{ property: "startTime", direction: "asc" }],
        });
    }

    async getLastUnfinished(andStarted = false): Promise<Exposure> {
        const query: any = {
            select: [],
            where: [{ property: "endTime", comparison: "equalTo", value: -1 }],
            order: [{ property: "startTime", direction: "desc" }],
        };
        if (andStarted) {
            query.where.push({
                logical: QueryLogicalOperator.AND,
                property: "startTime",
                comparison: "notEqualTo",
                value: -1,
            });
        }
        const unfinished = await this.store.fetch(query);

        if (unfinished.length === 0) {
            return null;
        }

        return unfinished[0];
    }

    async remove(id: string): Promise<void> {
        await this.store.delete(id);
    }

    async clear(): Promise<void> {
        await this.store.clear();
    }
}

export const exposures = new ExposuresStoreDB();

function docFrom(exposure: Exposure): any {
    const { startTime, endTime, place, emotionValues, successful } = exposure;

    return {
        startTime: startTime ? startTime.getTime() : -1,
        endTime: endTime ? endTime.getTime() : -1,
        place,
        emotionValues: [
            ...emotionValues.map((value) => ({
                timestamp: value.timestamp.getTime(),
                value: value.value,
            })),
        ],
        successful,
    };
}

function exposureFrom(doc: any): Exposure {
    const { id, startTime, endTime, place, emotionValues, successful } = doc;

    return {
        id,
        startTime: startTime !== -1 ? new Date(startTime) : null,
        endTime: endTime !== -1 ? new Date(endTime) : null,
        place,
        emotionValues: [
            ...emotionValues.map((value) => ({
                timestamp: new Date(value.timestamp),
                value: value.value,
            })),
        ],
        successful,
    };
}
