import { Change, Record } from "@geotecinit/emai-framework/entities";
import { AreaOfInterest } from "@geotecinit/emai-framework/entities/aois";
import { RecordType } from "~/app/core/record-type";

export class PreExposureCancelled extends Record {
    constructor(public place: AreaOfInterest, timestamp: Date = new Date()) {
        super(RecordType.PreExposureCancelled, timestamp, Change.NONE);
    }
}