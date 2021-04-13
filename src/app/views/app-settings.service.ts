import { Injectable } from "@angular/core";

import { android as androidApp } from "tns-core-modules/application";
import {
    getBoolean,
    setBoolean,
    remove,
} from "tns-core-modules/application-settings";

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
        return getBoolean(DATA_SHARING_CONSENT_KEY, false);
    }

    async setDataSharingConsent(consents: boolean): Promise<void> {
        setBoolean(DATA_SHARING_CONSENT_KEY, consents);
    }

    async unlink(): Promise<void> {
        await this.authService.logout();
        remove(DATA_SHARING_CONSENT_KEY); // ONLY FOR TESTING! Do not remove server-side stored consent on unlink!
        // TODO: Clear patient data
    }
}

function getApplicationVersionName(): string {
    if (androidApp) {
        const PackageManager = android.content.pm.PackageManager;
        const pkg = androidApp.context
            .getPackageManager()
            .getPackageInfo(
                androidApp.context.getPackageName(),
                PackageManager.GET_META_DATA
            );

        return pkg.versionName;
    } else {
        // TODO: Remove once iOS platform becomes installed
        // @ts-ignore
        return NSBundle.mainBundle().objectForInfoDictionaryKey(
            "CFBundleVersion"
        );
    }
}
