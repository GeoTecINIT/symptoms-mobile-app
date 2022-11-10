import { Record } from "@awarns/core/entities";
import { AppRecordType } from "~/app/core/app-record-type";
import { EmotionValue } from "~/app/core/persistence/exposures";

export class ExposurePlaceAggregate extends Record {
    constructor(
        public placeId: string,
        public placeName: string,
        public emotionValues: Array<EmotionValue>,
        timestamp: Date = new Date()
    ) {
        super(AppRecordType.ExposurePlaceAggregate, timestamp);
    }
}
