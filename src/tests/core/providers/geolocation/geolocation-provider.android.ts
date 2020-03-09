import { AndroidGeolocationProvider } from '~/app/core/providers/geolocation/geolocation-provider.android';
import { geolocationAccessNotGrantedError } from '~/app/core/providers/geolocation';

describe('Android Geolocation Provider', () => {
    if (typeof android === 'undefined') {
        return;
    }
    const geolocationProvider = new AndroidGeolocationProvider();

    const ORIGINAL_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = ORIGINAL_INTERVAL;
    });

    it('allows to check if geolocation is enabled or not', async () => {
        const enabled = await geolocationProvider.isEnabled();
        expect(enabled === true || enabled === false).toBeTruthy();
    });

    it('allows to request to enable the geolocation services', async () => {
        await geolocationProvider.enable();
    });

    it('allows to check if geolocation permissions are granted', () => {
        const permissionGranted = geolocationProvider.hasPermission();
        expect(
            permissionGranted === true || permissionGranted === false
        ).toBeTruthy();
    });

    it('allows to ask geolocation permissions', async () => {
        try {
            await geolocationProvider.requestPermission();
        } catch (e) {
            expect(e).toBe(geolocationAccessNotGrantedError);
        }
    });

    it('returns at least one geolocation when requested', async () => {
        const [locationsPromise] = geolocationProvider.next(1);
        const locations = await locationsPromise;
        expect(locations.length).toBe(1);
    });

    it('returns more than one geolocation when requested', async () => {
        const [locationsPromise] = geolocationProvider.next(3);
        const locations = await locationsPromise;
        expect(locations.length).toBe(3);
    });

    it('returns the locations collected until the time the request gets canceled', async () => {
        const [locationsPromise, stopCollecting] = geolocationProvider.next(5);
        setTimeout(() => stopCollecting(), 1000);
        const locations = await locationsPromise;
        expect(locations.length).toBeGreaterThan(0);
    });
});
