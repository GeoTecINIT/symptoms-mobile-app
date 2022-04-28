import { Change, Record } from "@awarns/core/entities";
import { RecordType } from "~/app/core/record-type";

export class BatteryLevel extends Record {
    static fromPercentage(level: number) {
        return new BatteryLevel(level);
    }
    constructor(public value: number, public capturedAt = new Date()) {
        super(RecordType.BatteryLevel, capturedAt, Change.NONE);
    }
}
