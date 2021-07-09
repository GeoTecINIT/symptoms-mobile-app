import { ApplicationSettings } from "@nativescript/core";

const DEVICE_ID_KEY = "DEVICE_PROFILE_ID";
const PATIENT_ID_KEY = "DEVICE_PROFILE_PATIENT_ID";

export interface DeviceProfile {
    id: string;
    patientId: string;
}

export interface DeviceProfileStore {
    linked: boolean;
    deviceId: string;
    patientId: string;
    load(profile: DeviceProfile): void;
    clear(): void;
}

class DeviceProfileAS implements DeviceProfileStore {
    get linked(): boolean {
        return !!this._deviceId;
    }

    get deviceId(): string {
        return this._deviceId;
    }

    get patientId(): string {
        return this._patientId;
    }

    private _deviceId: string;
    private _patientId: string;

    constructor() {
        this._deviceId = ApplicationSettings.getString(
            DEVICE_ID_KEY,
            undefined
        );
        this._patientId = ApplicationSettings.getString(
            PATIENT_ID_KEY,
            undefined
        );
    }

    load(profile: DeviceProfile) {
        const { id, patientId } = profile;
        this._deviceId = id;
        this._patientId = patientId;
        ApplicationSettings.setString(DEVICE_ID_KEY, id);
        ApplicationSettings.setString(PATIENT_ID_KEY, patientId);
    }

    clear() {
        ApplicationSettings.remove(DEVICE_ID_KEY);
        ApplicationSettings.remove(PATIENT_ID_KEY);
        this._deviceId = undefined;
        this._patientId = undefined;
    }
}

export const deviceProfile = new DeviceProfileAS();
