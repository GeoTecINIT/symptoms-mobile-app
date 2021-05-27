import { Change, Record } from "@geotecinit/emai-framework/entities";
import { AreaOfInterest } from "@geotecinit/emai-framework/entities/aois";

export class ExposureAreaLeftRecord extends Record {
    constructor(
        public place: AreaOfInterest,
        change: Change,
        timestamp: Date = new Date()
    ) {
        super("exposure-area-left", timestamp, change);
    }
}
