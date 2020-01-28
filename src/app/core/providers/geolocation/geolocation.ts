export class Geolocation {

    static fromAndroidLocation(location: android.location.Location) {
        return new Geolocation(
            location.getLatitude(),
            location.getLongitude(),
            location.getAltitude(),
            location.getSpeed(),
            location.getBearing(),
            new Date(location.getTime())
        );
    }
    constructor(
        private latitude: number,
        private longitude: number,
        private altitude: number,
        private speed: number,
        private bearing: number,
        private capturedAt: Date,
        private createdAt = new Date()
    ) {}
}
