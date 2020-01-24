import { AndroidGeolocationProvider } from '~/app/core/providers/geolocation/geolocation-provider.android';
import { geolocationAccessNotGrantedError } from '~/app/core/providers/geolocation';

describe('Android Geolocation Provider', () => {
    const geolocationProvider = new AndroidGeolocationProvider();

    it('allows to check if geolocation is enabled or not', async () => {
        const enabled = await geolocationProvider.isEnabled();
        expect(enabled).not.toBeUndefined();
    });

    it('allows to request to enable the geolocation services', async () => {
        await geolocationProvider.enable();
    });

    it('allows to check if geolocation permissions are granted', () => {
        const permissionGranted = geolocationProvider.hasPermission();
        expect(permissionGranted).not.toBeUndefined();
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
        const [locationsPromise] = geolocationProvider.next(2);
        const locations = await locationsPromise;
        expect(locations.length).toBe(2);
    });

    it('returns the locations gathered until the time the request gets canceled', async () => {
        const [locationsPromise, stopGathering] = geolocationProvider.next(5);
        setTimeout(() => stopGathering(), 1000);
        const locations = await locationsPromise;
        expect(locations.length).toBeGreaterThan(0);
    });
});
