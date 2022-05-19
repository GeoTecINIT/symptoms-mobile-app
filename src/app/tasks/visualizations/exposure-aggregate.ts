import { Record } from "@awarns/core/entities";
import { AppRecordType } from "~/app/core/app-record-type";
import { EmotionValue } from "~/app/core/persistence/exposures";

export class ExposureAggregate extends Record {
    constructor(
        public data: Array<ExposureAggregatePoint>,
        timestamp: Date = new Date()
    ) {
        super(AppRecordType.ExposureAggregate, timestamp);
    }
}

export interface ExposureAggregatePoint {
    placeId: string;
    placeName: string;
    emotionValues: Array<EmotionValue>;
}
