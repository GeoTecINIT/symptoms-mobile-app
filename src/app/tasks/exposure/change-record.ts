import { Change, Record } from "@geotecinit/emai-framework/entities";
import { EmotionValue } from "~/app/core/persistence/exposures";

export class ExposureChange extends Record {
    constructor(
        change: Change,
        timestamp: Date,
        public emotionValues: Array<EmotionValue>
    ) {
        super("exposure-change", timestamp, change);
    }
}
