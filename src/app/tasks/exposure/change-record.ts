import { Change, Record } from "@awarns/core/entities";
import { EmotionValue } from "~/app/core/persistence/exposures";
import { AreaOfInterest } from "@awarns/geofencing";
import { AppRecordType } from "~/app/core/app-record-type";
import { ContextualConditions, WeatherSummary } from "~/app/core/weather";

export class ExposureChange extends Record {
    constructor(
        change: Change,
        timestamp: Date,
        public exposureId: string,
        public place: AreaOfInterest,
        public emotionValues: Array<EmotionValue>,
        public successful: boolean = false,
        public contextualConditions?: ContextualConditions,
        public weatherSummary?: WeatherSummary,
    ) {
        super(AppRecordType.ExposureChange, timestamp, change);
    }
}
