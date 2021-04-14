import { Injectable } from "@angular/core";

import {
    Application,
    ApplicationSettings,
    isAndroid,
} from "@nativescript/core";

import { AuthService } from "./auth.service";

const DATA_SHARING_CONSENT_KEY = "APP_SETTINGS_DATA_SHARING_CONSENT";

@Injectable({
    providedIn: "root",
})
export class AppSettingsService {
    get version(): string {
        return getApplicationVersionName();
    }

    constructor(private authService: AuthService) {}

    async getDataSharingConsent(): Promise<boolean> {
        return ApplicationSettings.getBoolean(DATA_SHARING_CONSENT_KEY, false);
    }

    async setDataSharingConsent(consents: boolean): Promise<void> {
        ApplicationSettings.setBoolean(DATA_SHARING_CONSENT_KEY, consents);
    }

    async unlink(): Promise<void> {
        await this.authService.logout();
        remove(DATA_SHARING_CONSENT_KEY); // ONLY FOR TESTING! Do not remove server-side stored consent on unlink!
        // TODO: Clear patient data
    }
}

function getApplicationVersionName(): string {
    if (isAndroid) {
        const PackageManager = android.content.pm.PackageManager;
        const pkg = Application.android.context
            .getPackageManager()
            .getPackageInfo(
                Application.android.context.getPackageName(),
                PackageManager.GET_META_DATA
            );

        return pkg.versionName;
    } else {
        return NSBundle.mainBundle.objectForInfoDictionaryKey(
            "CFBundleVersion"
        );
    }
}
