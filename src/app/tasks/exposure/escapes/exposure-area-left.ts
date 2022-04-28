import { Change, Record } from "@awarns/core/entities";
import { AreaOfInterest } from "@awarns/core/entities/aois";
import { RecordType } from "~/app/core/record-type";

export class ExposureAreaLeftRecord extends Record {
    constructor(
        public place: AreaOfInterest,
        change: Change,
        timestamp: Date = new Date()
    ) {
        super(RecordType.ExposureAreaLeft, timestamp, change);
    }
}
