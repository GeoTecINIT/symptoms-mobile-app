import { EmotionValue } from "~/app/core/persistence/exposures";

export function calculateEmotionValuesAvg(values: Array<EmotionValue>): number {
    if (values.length === 0) {
        return 0;
    }

    const total = values.reduce((prev, curr) => prev + curr.value, 0);

    return total / values.length;
}
