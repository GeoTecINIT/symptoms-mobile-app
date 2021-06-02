import { Change, Record } from "@geotecinit/emai-framework/entities";
import { EmotionValue } from "~/app/core/persistence/exposures";
import { AreaOfInterest } from "@geotecinit/emai-framework/entities/aois";
import { RecordType } from "~/app/core/record-type";

export class ExposureChange extends Record {
    constructor(
        change: Change,
        timestamp: Date,
        public place: AreaOfInterest,
        public emotionValues: Array<EmotionValue>,
        public successful: boolean = false
    ) {
        super(RecordType.ExposureChange, timestamp, change);
    }
}
