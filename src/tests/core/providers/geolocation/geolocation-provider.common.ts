import {
    NativeGeolocationProvider,
    GeolocationProvider
} from '~/app/core/providers/geolocation';
import { Geolocation } from '~/app/core/providers/geolocation/geolocation';
import { PlatformType } from '~/app/core/providers/record-type';

describe('Geolocation Provider', () => {
    const providerInterrupt = jasmine.createSpy();
    let nativeProvider: NativeGeolocationProvider;
    let provider: GeolocationProvider;
    const measurementCount = 5;

    beforeEach(() => {
        nativeProvider = createNativeGeolocationProvider();
        spyOn(nativeProvider, 'requestPermission').and.returnValue(
            Promise.resolve()
        );
        spyOn(nativeProvider, 'enable').and.returnValue(Promise.resolve());

        provider = new GeolocationProvider(nativeProvider);
    });

    it('returns true if device can provide locations', async () => {
        spyOn(nativeProvider, 'hasPermission').and.returnValue(true);
        spyOn(nativeProvider, 'isEnabled').and.returnValue(
            Promise.resolve(true)
        );
        const isReady = await provider.isReady();
        expect(nativeProvider.hasPermission).toHaveBeenCalled();
        expect(nativeProvider.isEnabled).toHaveBeenCalled();
        expect(isReady).toBeTruthy();
    });

    it('returns false if geolocation access has not been granted', async () => {
        spyOn(nativeProvider, 'hasPermission').and.returnValue(false);
        spyOn(nativeProvider, 'isEnabled').and.returnValue(
            Promise.resolve(true)
        );
        const isReady = await provider.isReady();
        expect(nativeProvider.hasPermission).toHaveBeenCalled();
        expect(nativeProvider.isEnabled).not.toHaveBeenCalled();
        expect(isReady).toBeFalsy();
    });

    it('returns false if native location provider is not enabled', async () => {
        spyOn(nativeProvider, 'hasPermission').and.returnValue(true);
        spyOn(nativeProvider, 'isEnabled').and.returnValue(
            Promise.resolve(false)
        );
        const isReady = await provider.isReady();
        expect(nativeProvider.hasPermission).toHaveBeenCalled();
        expect(nativeProvider.isEnabled).toHaveBeenCalled();
        expect(isReady).toBeFalsy();
    });

    it('tries to prepare device for location data collection when required', async () => {
        spyOn(nativeProvider, 'hasPermission').and.returnValue(false);
        spyOn(nativeProvider, 'isEnabled').and.returnValue(
            Promise.resolve(false)
        );
        await provider.prepare();
        expect(nativeProvider.requestPermission).toHaveBeenCalled();
        expect(nativeProvider.enable).toHaveBeenCalled();
    });

    it('does not try to prepare device for location data collection when not required', async () => {
        spyOn(nativeProvider, 'hasPermission').and.returnValue(true);
        spyOn(nativeProvider, 'isEnabled').and.returnValue(
            Promise.resolve(true)
        );
        await provider.prepare();
        expect(nativeProvider.requestPermission).not.toHaveBeenCalled();
        expect(nativeProvider.enable).not.toHaveBeenCalled();
    });

    it('calculates the best location among 5 location updates', async () => {
        spyOn(nativeProvider, 'next').and.returnValue([
            Promise.resolve(fakeLocations),
            providerInterrupt
        ]);
        const [resultPromise] = provider.next();
        const result = await resultPromise;
        expect(nativeProvider.next).toHaveBeenCalledWith(measurementCount);
        expect(result).toEqual(fakeLocations[measurementCount - 1]);
    });

    it('returns null when no location is obtained', async () => {
        spyOn(nativeProvider, 'next').and.returnValue([
            Promise.resolve([]),
            providerInterrupt
        ]);
        const [resultPromise] = provider.next();
        const result = await resultPromise;
        expect(result).toEqual(null);
    });

    it('stops gathering locations when requested', async () => {
        spyOn(nativeProvider, 'next').and.returnValue([
            Promise.resolve([]),
            providerInterrupt
        ]);
        const [_, stopCollecting] = provider.next();
        stopCollecting();
        expect(providerInterrupt).toHaveBeenCalled();
    });
});

function createNativeGeolocationProvider(): NativeGeolocationProvider {
    return {
        isEnabled() {
            return Promise.resolve(true);
        },
        enable() {
            return Promise.resolve();
        },
        hasPermission() {
            return true;
        },
        requestPermission() {
            return Promise.resolve();
        },
        next(qty: number) {
            return [Promise.resolve([]), () => null];
        }
    };
}

const fakeLocations: Array<Geolocation> = [
    {
        type: PlatformType.Geolocation,
        latitude: 39.9939429,
        longitude: -0.0738488,
        altitude: 133.8000030517578,
        speed: 0.10904105752706528,
        bearing: 313.95758056640625,
        accuracy: 12.486000061035156,
        capturedAt: new Date('2020-01-28T15:09:59.000Z'),
        begin: new Date('2020-01-28T15:10:00.057Z'),
        end: new Date('2020-01-28T15:10:00.057Z')
    },
    {
        type: PlatformType.Geolocation,
        latitude: 39.9939409,
        longitude: -0.0738495,
        altitude: 133.8000030517578,
        speed: 0.07058636844158173,
        bearing: 274.8623962402344,
        accuracy: 12.565999984741211,
        capturedAt: new Date('2020-01-28T15:10:00.000Z'),
        begin: new Date('2020-01-28T15:10:01.054Z'),
        end: new Date('2020-01-28T15:10:01.054Z')
    },
    {
        type: PlatformType.Geolocation,
        latitude: 39.9939401,
        longitude: -0.0738498,
        altitude: 133.8000030517578,
        speed: 0.05994986742734909,
        bearing: 236.01693725585938,
        accuracy: 12.576000213623047,
        capturedAt: new Date('2020-01-28T15:10:01.000Z'),
        begin: new Date('2020-01-28T15:10:02.057Z'),
        end: new Date('2020-01-28T15:10:02.057Z')
    },
    {
        type: PlatformType.Geolocation,
        latitude: 39.9939143,
        longitude: -0.0738398,
        altitude: 133.8000030517578,
        speed: 0.0035138472449034452,
        bearing: 332.4197082519531,
        accuracy: 13.303000450134277,
        capturedAt: new Date('2020-01-28T15:10:02.000Z'),
        begin: new Date('2020-01-28T15:10:03.049Z'),
        end: new Date('2020-01-28T15:10:03.049Z')
    },
    {
        type: PlatformType.Geolocation,
        latitude: 39.9939159,
        longitude: -0.0738408,
        altitude: 133.8000030517578,
        speed: 0.046229247003793716,
        bearing: 333.66839599609375,
        accuracy: 13.373000144958496,
        capturedAt: new Date('2020-01-28T15:10:03.000Z'),
        begin: new Date('2020-01-28T15:10:04.068Z'),
        end: new Date('2020-01-28T15:10:04.068Z')
    }
];
