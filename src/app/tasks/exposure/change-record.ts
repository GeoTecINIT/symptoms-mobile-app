import { Change, Record } from "@awarns/core/entities";
import { EmotionValue } from "~/app/core/persistence/exposures";
import { AreaOfInterest } from "@awarns/geofencing";
import { AppRecordType } from "~/app/core/app-record-type";

export class ExposureChange extends Record {
    constructor(
        change: Change,
        timestamp: Date,
        public place: AreaOfInterest,
        public emotionValues: Array<EmotionValue>,
        public successful: boolean = false
    ) {
        super(AppRecordType.ExposureChange, timestamp, change);
    }
}
