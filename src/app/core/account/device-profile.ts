import { ServerApiClient } from "~/app/core/server";
import { getPackageName, getDeviceInfo } from "~/app/core/utils/app-info";
import { ApplicationSettings } from "@nativescript/core";
import { appConfigController } from "~/app/core/account";

const DEVICE_ID_KEY = "DEVICE_PROFILE_ID";
const PATIENT_ID_KEY = "DEVICE_PROFILE_PATIENT_ID";
const STUDY_ID_KEY = "DEVICE_PROFILE_STUDY_ID";

export interface DeviceProfile {
    id: string;
    patientId: string;
    studyId: string;
}

export interface DeviceProfileController {
    linked: boolean;
    deviceId: string;
    patientId: string;
    studyId: string;
    linkApp(accessCode: string): Promise<void>;
    logout(): Promise<void>;
}

export class DeviceProfileControllerImpl implements DeviceProfileController {
    get linked(): boolean {
        return !!this._deviceId;
    }

    get deviceId(): string {
        return this._deviceId;
    }

    get patientId(): string {
        return this._patientId;
    }

    get studyId(): string {
        return this._studyId;
    }

    private _deviceId: string;
    private _patientId: string;
    private _studyId: string;

    constructor(private serverClient: ServerApiClient) {
        this._deviceId = ApplicationSettings.getString(
            DEVICE_ID_KEY,
            undefined
        );
        this._patientId = ApplicationSettings.getString(
            PATIENT_ID_KEY,
            undefined
        );
        this._studyId = ApplicationSettings.getString(STUDY_ID_KEY, undefined);
    }

    async linkApp(accessCode: string): Promise<void> {
        const appId = getPackageName();
        const { os, osVersion, manufacturer, model } = getDeviceInfo();
        const resp = await this.serverClient.devices.linkApp({
            accessCode,
            appId,
            os,
            osVersion,
            manufacturer,
            model,
        });
        this.load(resp);
    }

    async logout(): Promise<void> {
        ApplicationSettings.remove(DEVICE_ID_KEY);
        ApplicationSettings.remove(PATIENT_ID_KEY);
        ApplicationSettings.remove(STUDY_ID_KEY);
        this._deviceId = undefined;
        this._patientId = undefined;
        this._studyId = undefined;
        appConfigController.reset();
    }

    private load(profile: DeviceProfile) {
        const { id, patientId, studyId } = profile;

        this._deviceId = id;
        this._patientId = patientId;
        this._studyId = studyId;

        ApplicationSettings.setString(DEVICE_ID_KEY, id);
        ApplicationSettings.setString(PATIENT_ID_KEY, patientId);
        ApplicationSettings.setString(STUDY_ID_KEY, studyId);
    }
}
