import { Change, Record } from "@awarns/core/entities";
import { AreaOfInterest } from "@awarns/geofencing";
import { AppRecordType } from "~/app/core/app-record-type";

export class PreExposureStarted extends Record {
    constructor(public place: AreaOfInterest, timestamp: Date = new Date()) {
        super(AppRecordType.PreExposureStarted, timestamp, Change.NONE);
    }
}
