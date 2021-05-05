import { Change, Record } from "@geotecinit/emai-framework/entities";

export class BatteryLevel extends Record {
    static fromPercentage(level: number) {
        return new BatteryLevel(level);
    }
    constructor(public value: number, public capturedAt = new Date()) {
        super("battery-level", capturedAt, Change.NONE);
    }
}
