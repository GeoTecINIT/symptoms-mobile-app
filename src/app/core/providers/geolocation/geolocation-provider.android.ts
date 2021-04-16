import { hasPermission, requestPermission } from "nativescript-permissions";
import { localize } from "@nativescript/localize";
import { Application } from "@nativescript/core";

import { Geolocation } from "./geolocation";
import {
    NativeGeolocationProvider,
    geolocationAccessNotGrantedError,
    geolocationServicesNotEnabledError,
} from ".";
import {
    ProviderInterruption,
    ProviderInterrupter,
} from "../provider-interrupter";
import { Logger, getLogger } from "../../utils/logger";

const REQUEST_AT_LEAST_EVERY = 1000;
const REQUEST_EVERY = 100;
const RESOLUTION_REQUIRED = 6;
const REQUEST_ENABLE_LOCATION = 53;

export class AndroidGeolocationProvider implements NativeGeolocationProvider {
    private locationRequest: com.google.android.gms.location.LocationRequest;
    private fusedLocationClient: com.google.android.gms.location.FusedLocationProviderClient;
    private settingsClient: com.google.android.gms.location.SettingsClient;

    private logger: Logger;

    constructor() {
        const location = com.google.android.gms.location;
        this.fusedLocationClient = location.LocationServices.getFusedLocationProviderClient(
            Application.android.context
        );
        this.settingsClient = location.LocationServices.getSettingsClient(
            Application.android.context
        );
        this.logger = getLogger("AndroidGeolocationProvider");
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
                Application.android.foregroundActivity === null ||
                typeof ex.getStatusCode !== "function" ||
                ex.getStatusCode() !== RESOLUTION_REQUIRED
            ) {
                this.logger.error(ex);
                throw geolocationServicesNotEnabledError;
            }

            return ex.startResolutionForResult(
                Application.android.foregroundActivity,
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
        if (Application.android.foregroundActivity === null) {
            throw geolocationAccessNotGrantedError;
        }

        try {
            return await requestPermission(
                android.Manifest.permission.ACCESS_FINE_LOCATION,
                localize("permissions.location")
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
        const OnSuccessListener =
            com.google.android.gms.tasks.OnSuccessListener;
        const OnFailureListener =
            com.google.android.gms.tasks.OnFailureListener;

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
                            ),
                    })
                )
                .addOnFailureListener(
                    new OnFailureListener({
                        onFailure: (ex) => reject(ex),
                    })
                );
        });
    }

    private checkLocationSettings(): Promise<void> {
        const location = com.google.android.gms.location;
        const settingsRequest = new location.LocationSettingsRequest.Builder()
            .addLocationRequest(this.getLocationRequest())
            .build();
        const OnSuccessListener =
            com.google.android.gms.tasks.OnSuccessListener;
        const OnFailureListener =
            com.google.android.gms.tasks.OnFailureListener;

        return new Promise((resolve, reject) => {
            this.settingsClient
                .checkLocationSettings(settingsRequest)
                .addOnSuccessListener(
                    new OnSuccessListener({
                        onSuccess: () => resolve(),
                    })
                )
                .addOnFailureListener(
                    new OnFailureListener({
                        onFailure: (ex: any) => {
                            reject(ex);
                        },
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

            const callback = this.createGeolocationCallback((geolocation) => {
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

    private startListeningLocations(
        callback: com.google.android.gms.location.LocationCallback
    ) {
        this.fusedLocationClient.requestLocationUpdates(
            this.getLocationRequest(),
            callback,
            null
        );
    }

    private stopListeningLocations(
        callback: com.google.android.gms.location.LocationCallback
    ) {
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

    private getLocationRequest(): com.google.android.gms.location.LocationRequest {
        const location = com.google.android.gms.location;
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

    private createGeolocationCallback(
        geolocationAcquired: (location: Geolocation) => void
    ) {
        // tslint:disable-next-line:max-classes-per-file
        const geolocationCallback = class extends com.google.android.gms
            .location.LocationCallback {
            constructor(
                private onNextGeolocation: (location: Geolocation) => void
            ) {
                super();

                return global.__native(this);
            }

            onLocationResult(
                result: com.google.android.gms.location.LocationResult
            ) {
                if (!result) {
                    return;
                }
                const geolocation = Geolocation.fromAndroidLocation(
                    result.getLastLocation()
                );
                this.onNextGeolocation(geolocation);
            }
        };

        return new geolocationCallback(geolocationAcquired);
    }
}
