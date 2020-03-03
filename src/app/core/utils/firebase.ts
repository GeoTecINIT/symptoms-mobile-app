import * as fb from 'nativescript-plugin-firebase';
import { getBoolean, setBoolean } from 'tns-core-modules/application-settings';

const DATA_COLLECTION_ENABLED = 'firebase-manager/dataCollectionEnabled';

export class FirebaseManager {
    private initialized = false;
    private initPromise: Promise<any>;

    get dataCollectionEnabled() {
        return getBoolean(DATA_COLLECTION_ENABLED);
    }

    async init() {
        if (this.initialized) {
            return;
        }
        if (!this.initPromise) {
            this.initPromise = fb.init({
                crashlyticsCollectionEnabled: this.dataCollectionEnabled,
                analyticsCollectionEnabled: this.dataCollectionEnabled
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

        return fb.crashlytics;
    }

    async enableUsageDataCollection() {
        await this.init();
        const yes = true;

        setBoolean(DATA_COLLECTION_ENABLED, yes);
        fb.crashlytics.setCrashlyticsCollectionEnabled(yes);
        fb.analytics.setAnalyticsCollectionEnabled(yes);
    }

    async disableUsageDataCollection() {
        await this.init();
        const no = false;

        setBoolean(DATA_COLLECTION_ENABLED, no);
        fb.crashlytics.setCrashlyticsCollectionEnabled(no);
        fb.analytics.setAnalyticsCollectionEnabled(no);
    }
}

export const firebaseInstance = new FirebaseManager();
