import { Injectable } from "@angular/core";

import { ApplicationSettings } from "@nativescript/core";

import { AuthService } from "./auth.service";
import { emitTreatmentStopEvent } from "~/app/core/framework/events";
import { clearEMAIDB } from "@geotecinit/emai-framework/storage";
import { exportData } from "~/app/core/framework/data-exporter";
import { getVersionName } from "~/app/core/utils/app-info";

const DATA_SHARING_CONSENT_KEY = "APP_SETTINGS_DATA_SHARING_CONSENT";
const REPORT_USAGE_CONSENT_KEY = "APP_SETTINGS_REPORT_USAGE_CONSENT";
const SETUP_COMPLETE_KEY = "APP_SETTINGS_SETUP_COMPLETE";

@Injectable({
    providedIn: "root",
})
export class AppSettingsService {
    get version(): string {
        return getVersionName();
    }

    constructor(private authService: AuthService) {}

    async getDataSharingConsent(): Promise<boolean> {
        return ApplicationSettings.getBoolean(DATA_SHARING_CONSENT_KEY, false);
    }

    async setDataSharingConsent(consents: boolean): Promise<void> {
        ApplicationSettings.setBoolean(DATA_SHARING_CONSENT_KEY, consents);
    }

    async getReportUsageConsent(): Promise<boolean> {
        return ApplicationSettings.getBoolean(REPORT_USAGE_CONSENT_KEY, false);
    }

    async setReportUsageConsent(consents: boolean): Promise<void> {
        ApplicationSettings.setBoolean(REPORT_USAGE_CONSENT_KEY, consents);
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
