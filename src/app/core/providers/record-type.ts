export enum PlatformType {
    Geolocation = 'geolocation'
}

export class RecordType {
    constructor(
        public type: PlatformType,
        public startsAt = new Date(),
        public endsAt = new Date()
    ) {}
}
