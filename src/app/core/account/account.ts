import {
    DeviceProfileController,
    DeviceProfileControllerImpl,
} from "./device-profile";
import {
    PatientProfileController,
    PatientProfileControllerImpl,
} from "./patient-profile";
import { serverApi } from "~/app/core/server";

export interface Account {
    deviceProfile: DeviceProfileController;
    patientProfile: PatientProfileController;
    reset(): void;
}

class AccountImpl implements Account {
    get deviceProfile() {
        return this._deviceProfile;
    }

    get patientProfile() {
        return this._patientProfile;
    }

    private _deviceProfile: DeviceProfileController;
    private _patientProfile: PatientProfileController;

    constructor() {
        this.reset();
    }

    reset() {
        this._deviceProfile = new DeviceProfileControllerImpl(serverApi);
        this._patientProfile = new PatientProfileControllerImpl(
            serverApi,
            this._deviceProfile
        );
    }
}

export const account = new AccountImpl();
