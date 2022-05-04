import { Change, Record } from "@awarns/core/entities";
import { AreaOfInterest } from "@awarns/geofencing";
import { RecordType } from "~/app/core/record-type";

export class PreExposureCancelled extends Record {
    constructor(public place: AreaOfInterest, timestamp: Date = new Date()) {
        super(RecordType.PreExposureCancelled, timestamp, Change.NONE);
    }
}
