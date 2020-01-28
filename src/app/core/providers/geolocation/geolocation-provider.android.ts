import { hasPermission, requestPermission } from 'nativescript-permissions';
import { localize } from 'nativescript-localize';
import { android as androidApp } from 'tns-core-modules/application/application';

import { Geolocation } from './geolocation';
import {
    NativeGeolocationProvider,
    geolocationAccessNotGrantedError,
    geolocationServicesNotEnabledError
} from '.';
import {
    ProviderInterruption,
    ProviderInterrupter
} from '../provider-interrupter';

const REQUEST_AT_LEAST_EVERY = 1000;
const REQUEST_EVERY = 100;
const RESOLUTION_REQUIRED = 6;
const REQUEST_ENABLE_LOCATION = 53;

const OnSuccessListener = com.google.android.gms.tasks.OnSuccessListener;
const OnFailureListener = com.google.android.gms.tasks.OnFailureListener;
const location = com.google.android.gms.location;
type LocationRequest = com.google.android.gms.location.LocationRequest;
type LocationResult = com.google.android.gms.location.LocationResult;
type FusedLocationProviderClient = com.google.android.gms.location.FusedLocationProviderClient;
type LocationSettingsClient = com.google.android.gms.location.SettingsClient;

export class AndroidGeolocationProvider implements NativeGeolocationProvider {
    private locationRequest: LocationRequest;
    private fusedLocationClient: FusedLocationProviderClient;
    private settingsClient: LocationSettingsClient;

    constructor() {
        this.fusedLocationClient = location.LocationServices.getFusedLocationProviderClient(
            androidApp.context
        );
        this.settingsClient = location.LocationServices.getSettingsClient(
            androidApp.context
        );
    }

    async isEnabled(): Promise<boolean> {
        try {
            await this.checkLocationSettings();

            return true;
        } catch (e) {
            return false;
        }
    }

    async enable(): Promise<void> {
        try {
            return await this.checkLocationSettings();
        } catch (ex) {
            if (
                androidApp.foregroundActivity === null ||
                typeof ex.getStatusCode !== 'function' ||
                ex.getStatusCode() !== RESOLUTION_REQUIRED
            ) {
                console.log(`AndroidGeolocationProvider: ${ex}`);
                throw geolocationServicesNotEnabledError;
            }

            return ex.startResolutionForResult(
                androidApp.foregroundActivity,
                REQUEST_ENABLE_LOCATION
            );
        }
    }

    hasPermission(): boolean {
        return hasPermission(android.Manifest.permission.ACCESS_FINE_LOCATION);
    }

    async requestPermission(): Promise<void> {
        if (this.hasPermission()) {
            return;
        }
        if (androidApp.foregroundActivity === null) {
            throw geolocationAccessNotGrantedError;
        }

        try {
            return await requestPermission(
                android.Manifest.permission.ACCESS_FINE_LOCATION,
                localize('permissions.location')
            );
        } catch (e) {
            throw geolocationAccessNotGrantedError;
        }
    }

    next(
        quantity: number
    ): [Promise<Array<Geolocation>>, ProviderInterruption] {
        const interrupter = new ProviderInterrupter();
        const listener = this.createLocationListener(
            quantity,
            interrupter
        ).then((locations) =>
            locations.length > 0
                ? locations
                : this.getLastKnownLocation().then((loc) => [loc])
        );

        return [listener, () => interrupter.interrupt()];
    }

    private async getLastKnownLocation(): Promise<Geolocation> {
        await this.canGetLocations();

        return new Promise((resolve, reject) => {
            this.fusedLocationClient
                .getLastLocation()
                .addOnSuccessListener(
                    new OnSuccessListener({
                        onSuccess: (loc) =>
                            resolve(
                                loc
                                    ? Geolocation.fromAndroidLocation(loc)
                                    : null
                            )
                    })
                )
                .addOnFailureListener(
                    new OnFailureListener({
                        onFailure: (ex) => reject(ex)
                    })
                );
        });
    }

    private checkLocationSettings(): Promise<void> {
        const settingsRequest = new location.LocationSettingsRequest.Builder()
            .addLocationRequest(this.getLocationRequest())
            .build();

        return new Promise((resolve, reject) => {
            this.settingsClient
                .checkLocationSettings(settingsRequest)
                .addOnSuccessListener(
                    new OnSuccessListener({
                        onSuccess: () => resolve()
                    })
                )
                .addOnFailureListener(
                    new OnFailureListener({
                        onFailure: (ex: any) => {
                            reject(ex);
                        }
                    })
                );
        });
    }

    private async createLocationListener(
        quantity: number,
        interrupter: ProviderInterrupter
    ): Promise<Array<Geolocation>> {
        await this.canGetLocations();

        return new Promise((resolve) => {
            const locations: Array<Geolocation> = [];

            const callback = new GeolocationCallback((geolocation) => {
                locations.push(geolocation);
                if (locations.length === quantity) {
                    this.stopListeningLocations(callback);
                    resolve(locations);
                }
            });

            this.startListeningLocations(callback);
            interrupter.interruption = () => {
                this.stopListeningLocations(callback);
                resolve(locations);
            };
        });
    }

    private startListeningLocations(callback: GeolocationCallback) {
        this.fusedLocationClient.requestLocationUpdates(
            this.getLocationRequest(),
            callback,
            null
        );
    }

    private stopListeningLocations(callback: GeolocationCallback) {
        this.fusedLocationClient.removeLocationUpdates(callback);
    }

    private async canGetLocations() {
        if (!this.hasPermission()) {
            throw geolocationAccessNotGrantedError;
        }
        const isEnabled = await this.isEnabled();
        if (!isEnabled) {
            throw geolocationServicesNotEnabledError;
        }
    }

    private getLocationRequest(): LocationRequest {
        if (!this.locationRequest) {
            this.locationRequest = new location.LocationRequest();
            this.locationRequest.setInterval(REQUEST_AT_LEAST_EVERY);
            this.locationRequest.setFastestInterval(REQUEST_EVERY);
            this.locationRequest.setPriority(
                location.LocationRequest.PRIORITY_HIGH_ACCURACY
            );
        }

        return this.locationRequest;
    }
}

// tslint:disable-next-line:max-classes-per-file
class GeolocationCallback extends location.LocationCallback {
    constructor(private onNextGeolocation: (location: Geolocation) => void) {
        super();

        return global.__native(this);
    }

    onLocationResult(result: LocationResult) {
        if (!result) {
            return;
        }
        const geolocation = Geolocation.fromAndroidLocation(
            result.getLastLocation()
        );
        this.onNextGeolocation(geolocation);
    }
}
