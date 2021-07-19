import { Injectable } from "@angular/core";
import {
    AuthManager,
    firebaseAuthManager,
    SessionData,
} from "./firebase-auth-manager";

@Injectable({
    providedIn: "root",
})
export class FirebaseAuthService implements AuthManager {
    sessionData(): Promise<SessionData> {
        return firebaseAuthManager.sessionData();
    }

    authToken(): Promise<string> {
        return firebaseAuthManager.authToken();
    }

    refreshToken(): Promise<void> {
        return firebaseAuthManager.refreshToken();
    }

    clearSession(): Promise<void> {
        return firebaseAuthManager.clearSession();
    }
}
