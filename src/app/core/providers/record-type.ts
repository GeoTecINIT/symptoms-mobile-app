export enum PlatformType {
    Geolocation = 'geolocation',
    BatteryLevel = 'batteryLevel'
}

export class RecordType {
    constructor(
        public type: PlatformType,
        public startsAt = new Date(),
        public endsAt = new Date()
    ) {}
}
