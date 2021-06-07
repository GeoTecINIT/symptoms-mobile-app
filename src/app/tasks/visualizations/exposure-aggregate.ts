import { Record } from "@geotecinit/emai-framework/entities";
import { RecordType } from "~/app/core/record-type";
import { EmotionValue } from "~/app/core/persistence/exposures";

export class ExposureAggregate extends Record {
    constructor(
        public data: Array<ExposureAggregatePoint>,
        timestamp: Date = new Date()
    ) {
        super(RecordType.ExposureAggregate, timestamp);
    }
}

export interface ExposureAggregatePoint {
    placeId: string;
    placeName: string;
    emotionValues: Array<EmotionValue>;
}
