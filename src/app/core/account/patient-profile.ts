import { serverApi, ServerApiClient } from "~/app/core/server";
import { deviceProfile, DeviceProfileController } from "./device-profile";
import { ApplicationSettings } from "@nativescript/core";
import { getLogger, Logger } from "~/app/core/utils/logger";

const PROFILE_INFO_KEY = "PATIENT_PROFILE_INFO";
const DATA_SHARING_KEY = "PATIENT_PROFILE_DATA_SHARING_CONSENT";

export interface PatientProfile {
    id: string;
    fileId: string;
    therapist: {
        id: string;
        firstName: string;
        lastName: string;
        workPhone: string;
    };
    study: {
        id: string;
    };
}

export interface PatientProfileController {
    info: PatientProfile;
    reloadInfo(): Promise<void>;
    consentsToShareData: boolean;
    updateDataSharingConsent(consents: boolean): Promise<void>;
}

export class PatientProfileControllerImpl implements PatientProfileController {
    get info(): PatientProfile {
        return this._profileInfo;
    }

    get consentsToShareData(): boolean {
        return this._dataSharingConsent;
    }

    private readonly _isNew: boolean;
    private _profileInfo: PatientProfile;
    private _dataSharingConsent: boolean;

    private logger: Logger;

    constructor(
        private serverClient: ServerApiClient,
        private deviceController: DeviceProfileController
    ) {
        this._isNew = !ApplicationSettings.hasKey(DATA_SHARING_KEY);
        this._dataSharingConsent = ApplicationSettings.getBoolean(
            DATA_SHARING_KEY,
            false
        );

        this._profileInfo = ApplicationSettings.hasKey(PROFILE_INFO_KEY)
            ? JSON.parse(ApplicationSettings.getString(PROFILE_INFO_KEY))
            : null;

        this.sync().catch((e) => {
            this.getLogger().warn(
                `Could not synchronize patient profile. Reason: ${e}`
            );
        });
    }

    async reloadInfo(): Promise<void> {
        const { patientId } = this.deviceController;
        const patient = await this.serverClient.patients.get(patientId);
        const therapist = await this.serverClient.therapists.get(
            patient.therapistId
        );

        const { id, fileId, studyId } = patient;
        const study = { id: studyId };
        this._profileInfo = { id, fileId, therapist, study };

        const serializedProfile = JSON.stringify(this._profileInfo);
        ApplicationSettings.setString(PROFILE_INFO_KEY, serializedProfile);
        this.getLogger().debug(
            `Patient profile reloaded!: ${serializedProfile}`
        );
    }

    async updateDataSharingConsent(consents: boolean) {
        this._dataSharingConsent = consents;
        ApplicationSettings.setBoolean(DATA_SHARING_KEY, consents);
        try {
            await this.serverClient.patients.updateConsent({
                dataSharing: consents,
            });
        } catch (e) {
            this.getLogger().warn(
                `Could not update patient settings. Reason: ${e}`
            );
        }
    }

    private async sync() {
        await this.syncInfo();
        await this.syncSettings();
    }

    private async syncInfo() {
        if (this._isNew || this._profileInfo !== null) return;
        this.getLogger().warn(
            "Patient profile info is out of sync! Reloading..."
        );

        await this.reloadInfo();
    }

    private async syncSettings() {
        if (this._isNew) return;
        const remoteState = await this.serverClient.patients.getConsent();
        if (remoteState.dataSharing !== this._dataSharingConsent) {
            this.getLogger().warn(
                "Patient settings are out of sync! Updating..."
            );
            await this.serverClient.patients.updateConsent({
                dataSharing: this._dataSharingConsent,
            });
        }
    }

    private getLogger() {
        if (!this.logger) {
            this.logger = getLogger("PatientProfileController");
        }

        return this.logger;
    }
}

export const patientProfile = new PatientProfileControllerImpl(
    serverApi,
    deviceProfile
);
