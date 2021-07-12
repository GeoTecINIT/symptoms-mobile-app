import { serverApi, ServerApiClient } from "~/app/core/server";
import { ApplicationSettings } from "@nativescript/core";
import { getLogger, Logger } from "~/app/core/utils/logger";

const DATA_SHARING_KEY = "PATIENT_PROFILE_DATA_SHARING_CONSENT";

export interface PatientProfileController {
    consentsToShareData: boolean;
    updateDataSharingConsent(consents: boolean): Promise<void>;
}

export class PatientProfileControllerImpl implements PatientProfileController {
    get consentsToShareData(): boolean {
        return this._dataSharingConsent;
    }

    private readonly _isNew: boolean;
    private _dataSharingConsent: boolean;

    private logger: Logger;

    constructor(private serverClient: ServerApiClient) {
        this._isNew = !ApplicationSettings.hasKey(DATA_SHARING_KEY);
        this._dataSharingConsent = ApplicationSettings.getBoolean(
            DATA_SHARING_KEY,
            false
        );
        this.sync().catch((e) =>
            this.getLogger().warn(
                `Could not synchronize patient settings. Reason: ${e}`
            )
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

export const patientProfile = new PatientProfileControllerImpl(serverApi);
