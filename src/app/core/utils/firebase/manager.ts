import { ApplicationSettings } from "@nativescript/core";
import { firebase } from "@nativescript/firebase";
import { crashlytics } from "@nativescript/firebase/crashlytics";
import { analytics } from "@nativescript/firebase/analytics";

const DATA_COLLECTION_ENABLED = "firebase-manager/dataCollectionEnabled";

export class FirebaseManager {
    private initialized = false;
    private initPromise: Promise<any>;

    get dataCollectionEnabled() {
        return ApplicationSettings.getBoolean(DATA_COLLECTION_ENABLED, false);
    }

    async init() {
        if (this.initialized) {
            return;
        }
        if (!this.initPromise) {
            this.initPromise = firebase.init({
                crashlyticsCollectionEnabled: this.dataCollectionEnabled,
                analyticsCollectionEnabled: this.dataCollectionEnabled,
            });
        }
        await this.initPromise;
        this.initialized = true;
    }

    async crashlytics() {
        if (!this.dataCollectionEnabled) {
            return null;
        }
        await this.init();

        return crashlytics;
    }

    async enableUsageDataCollection() {
        await this.init();
        const yes = true;

        ApplicationSettings.setBoolean(DATA_COLLECTION_ENABLED, yes);
        crashlytics.setCrashlyticsCollectionEnabled(yes);
        analytics.setAnalyticsCollectionEnabled(yes);
    }

    async disableUsageDataCollection() {
        await this.init();
        const no = false;

        ApplicationSettings.setBoolean(DATA_COLLECTION_ENABLED, no);
        crashlytics.setCrashlyticsCollectionEnabled(no);
        analytics.setAnalyticsCollectionEnabled(no);
    }

    async getInstance() {
        await this.init();

        return firebase;
    }
}

export const firebaseManager = new FirebaseManager();
