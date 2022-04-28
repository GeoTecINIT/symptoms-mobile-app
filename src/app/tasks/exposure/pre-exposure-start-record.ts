import { Change, Record } from "@awarns/core/entities";
import { AreaOfInterest } from "@awarns/core/entities/aois";
import { RecordType } from "~/app/core/record-type";

export class PreExposureStarted extends Record {
    constructor(public place: AreaOfInterest, timestamp: Date = new Date()) {
        super(RecordType.PreExposureStarted, timestamp, Change.NONE);
    }
}
