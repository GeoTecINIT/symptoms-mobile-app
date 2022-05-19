import { Change, Record } from "@awarns/core/entities";
import { AreaOfInterest } from "@awarns/geofencing";
import { AppRecordType } from "~/app/core/app-record-type";

export class ExposureAreaLeftRecord extends Record {
    constructor(
        public place: AreaOfInterest,
        change: Change,
        timestamp: Date = new Date()
    ) {
        super(AppRecordType.ExposureAreaLeft, timestamp, change);
    }
}
