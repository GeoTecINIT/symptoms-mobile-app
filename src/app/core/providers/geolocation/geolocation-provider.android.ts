import { hasPermission, requestPermission } from 'nativescript-permissions';
import { localize } from 'nativescript-localize';
import { android as androidApp } from 'tns-core-modules/application/application';
import {
    NativeGeolocationProvider,
    ProviderInterruption,
    geolocationAccessNotGrantedError
} from '.';
import { Geolocation } from './geolocation';

const REQUEST_AT_LEAST_EVERY = 1000;
const REQUEST_EVERY = 100;

const OnSuccessListener = com.google.android.gms.tasks.OnSuccessListener;
const OnFailureListener = com.google.android.gms.tasks.OnFailureListener;
const location = com.google.android.gms.location;
type LocationRequest = com.google.android.gms.location.LocationRequest;
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

    isEnabled(): Promise<boolean> {
        const settingsRequest = new location.LocationSettingsRequest.Builder()
            .addLocationRequest(this.getLocationRequest())
            .build();

        return new Promise((resolve, reject) => {
            this.settingsClient
                .checkLocationSettings(settingsRequest)
                .addOnSuccessListener(
                    new OnSuccessListener({
                        onSuccess: () => resolve(true)
                    })
                )
                .addOnFailureListener(
                    new OnFailureListener({
                        onFailure: () => resolve(false)
                    })
                );
        });
    }
    enable(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    hasPermission(): boolean {
        return hasPermission(android.Manifest.permission.ACCESS_FINE_LOCATION);
    }
    requestPermission(): Promise<void> {
        if (this.hasPermission()) {
            return;
        }
        const activity = this.getActivity();
        if (activity !== null) {
            return new Promise((resolve, reject) => {
                requestPermission(
                    android.Manifest.permission.ACCESS_FINE_LOCATION,
                    localize('permissions.location')
                )
                    .then(() => resolve())
                    .catch(() => reject(geolocationAccessNotGrantedError));
            });
        }
    }
    next(
        quantity: number
    ): [Promise<Array<Geolocation>>, ProviderInterruption] {
        throw new Error('Method not implemented.');
    }

    private getLocationRequest(): LocationRequest {
        if (this.locationRequest === null) {
            this.locationRequest = new location.LocationRequest();
            this.locationRequest.setInterval(REQUEST_AT_LEAST_EVERY);
            this.locationRequest.setFastestInterval(REQUEST_EVERY);
            this.locationRequest.setPriority(
                location.LocationRequest.PRIORITY_HIGH_ACCURACY
            );
        }

        return this.locationRequest;
    }

    private getActivity(): android.app.Activity {
        if (androidApp.context instanceof android.app.Activity) {
            return androidApp.context as android.app.Activity;
        }
    }
}
