import { ExposuresStore } from "~/app/core/persistence/exposures";

export async function extractEmotionValuesFromOngoingExposure(
    store: ExposuresStore
): Promise<Array<number>> {
    const ongoingExposure = await store.getLastUnfinished();
    if (!ongoingExposure) {
        throw new Error("There is no exposure ongoing!");
    }

    return ongoingExposure.emotionValues.map(
        (emotionValue) => emotionValue.value
    );
}

export function evaluateLastEmotionValue(
    values: Array<number>,
    threshold: number
): "not-enough" | "below" | "above" {
    if (values.length === 0) {
        return "not-enough";
    }

    const lastValue = values[values.length - 1];

    return lastValue < threshold ? "below" : "above";
}
