export enum PlatformType {
    Geolocation = 'geolocation'
}

export class RecordType {
    constructor(
        public type: PlatformType,
        public begin = new Date(),
        public end = new Date()
    ) {}
}
