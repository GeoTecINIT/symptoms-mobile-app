import { RecordType, PlatformType } from "../record-type";

export class BatteryLevel extends RecordType {
    static fromPercentage(level: number) {
        return new BatteryLevel(level);
    }
    constructor(public value: number, public capturedAt = new Date()) {
        super(PlatformType.BatteryLevel, capturedAt, capturedAt);
    }
}
