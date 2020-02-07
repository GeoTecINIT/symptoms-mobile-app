import { RecordType, PlatformType } from '../record-type';

export class Geolocation extends RecordType {
    static fromAndroidLocation(location: android.location.Location) {
        return new Geolocation(
            location.getLatitude(),
            location.getLongitude(),
            location.getAltitude(),
            location.getSpeed(),
            location.getBearing(),
            location.getAccuracy(),
            new Date(location.getTime())
        );
    }
    constructor(
        public latitude: number,
        public longitude: number,
        public altitude: number,
        public speed: number,
        public bearing: number,
        public accuracy: number,
        public capturedAt: Date,
        public begin = new Date()
    ) {
        super(PlatformType.Geolocation, begin, begin);
    }
}
