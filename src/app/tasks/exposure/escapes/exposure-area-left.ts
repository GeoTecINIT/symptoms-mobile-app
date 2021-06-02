import { Change, Record } from "@geotecinit/emai-framework/entities";
import { AreaOfInterest } from "@geotecinit/emai-framework/entities/aois";
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
