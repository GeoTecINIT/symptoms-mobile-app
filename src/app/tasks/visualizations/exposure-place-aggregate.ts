import { Record } from "@geotecinit/emai-framework/entities";
import { RecordType } from "~/app/core/record-type";
import { EmotionValue } from "~/app/core/persistence/exposures";

export class ExposurePlaceAggregate extends Record {
    constructor(
        public placeId: string,
        public placeName: string,
        public emotionValues: Array<EmotionValue>,
        timestamp: Date = new Date()
    ) {
        super(RecordType.ExposurePlaceAggregate, timestamp);
    }
}
