import { Injectable } from "@angular/core";
import { firebaseManager } from "./manager";

@Injectable({
    providedIn: "root",
})
export class FirebaseManagerService {
    get usageDataCollectionEnabled() {
        return firebaseManager.dataCollectionEnabled;
    }

    updateUsageDataCollectionConsent(consents: boolean) {
        if (consents) {
            return firebaseManager.enableUsageDataCollection();
        }

        return firebaseManager.disableUsageDataCollection();
    }
}
