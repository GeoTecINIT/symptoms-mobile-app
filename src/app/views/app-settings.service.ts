import { Injectable } from "@angular/core";

import { ApplicationSettings } from "@nativescript/core";

import { FirebaseManagerService } from "~/app/core/utils/firebase";
import { AuthService } from "./auth.service";
import { emitTreatmentStopEvent } from "~/app/core/framework/events";
import { clearEMAIDB } from "@geotecinit/emai-framework/storage";
import { exportData } from "~/app/core/framework/data-exporter";
import { getVersionName } from "~/app/core/utils/app-info";
import { AccountService } from "~/app/core/account";

const SETUP_COMPLETE_KEY = "APP_SETTINGS_SETUP_COMPLETE";

@Injectable({
    providedIn: "root",
})
export class AppSettingsService {
    get version(): string {
        return getVersionName();
    }

    constructor(
        private accountService: AccountService,
        private firebaseManagerService: FirebaseManagerService,
        private authService: AuthService
    ) {}

    async getDataSharingConsent(): Promise<boolean> {
        return this.accountService.patientProfile.consentsToShareData;
    }

    async setDataSharingConsent(consents: boolean): Promise<void> {
        return this.accountService.patientProfile.updateDataSharingConsent(
            consents
        );
    }

    async getReportUsageConsent(): Promise<boolean> {
        return this.firebaseManagerService.usageDataCollectionEnabled;
    }

    async setReportUsageConsent(consents: boolean): Promise<void> {
        return this.firebaseManagerService.updateUsageDataCollectionConsent(
            consents
        );
    }

    isSetupComplete(): boolean {
        return ApplicationSettings.getBoolean(SETUP_COMPLETE_KEY, false);
    }

    markSetupAsComplete() {
        return ApplicationSettings.setBoolean(SETUP_COMPLETE_KEY, true);
    }

    async unlink(): Promise<void> {
        emitTreatmentStopEvent();
        await this.authService.logout();
        ApplicationSettings.clear();
        await clearEMAIDB();
    }

    exportData(): Promise<string> {
        return exportData("Abrir archivo comprimido con:");
    }
}
