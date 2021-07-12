import { FirebaseManager, firebaseManager } from "../utils/firebase";
import { Logger, getLogger } from "../utils/logger";
import { firebase as fb } from "@nativescript/firebase";
import User = fb.User;

export interface AuthManager {
    sessionData(): Promise<SessionData>;
    authToken(): Promise<string>;
}

class FirebaseAuthManager implements AuthManager {
    private logger: Logger;
    private firebaseManager: FirebaseManager;
    private initPromise: Promise<any>;
    private initialized = false;

    constructor() {
        this.logger = getLogger("FirebaseAuthManager");
        this.firebaseManager = firebaseManager;
    }

    async init() {
        if (this.initialized) {
            return;
        }
        if (!this.initPromise) {
            const firebase = await firebaseManager.getInstance();
            this.initPromise = firebase.login({
                type: firebase.LoginType.ANONYMOUS,
            });
        }
        const user = await this.initPromise;
        const sessionData = sessionDataFromUser(user);
        this.logger.info(`Logged in as: ${JSON.stringify(sessionData)}`);
        this.firebaseManager.crashlytics().then((crashlytics) => {
            if (crashlytics) {
                crashlytics.setUserId(sessionData.id);
            }
        });
        this.initialized = true;
    }

    async sessionData(): Promise<SessionData> {
        const user = await this.getCurrentUser();

        return sessionDataFromUser(user);
    }

    async authToken(): Promise<string> {
        const user = await this.getCurrentUser();

        const token = await user.getIdToken();
        this.logger.info(`Token: ${token}`);

        return token;
    }

    private async getCurrentUser(): Promise<User> {
        await this.init();
        const firebase = await this.firebaseManager.getInstance();
        await firebase.reloadUser();

        return firebase.getCurrentUser();
    }
}

export const firebaseAuthManager = new FirebaseAuthManager();

export interface SessionData {
    id: string;
    isNew: boolean;
    createdAt: Date;
    lastLogin: Date;
}

function sessionDataFromUser(user: any): SessionData {
    const {
        uid,
        additionalUserInfo: { isNewUser },
        metadata: { creationTimestamp, lastSignInTimestamp },
    } = user;

    return {
        id: uid,
        isNew: isNewUser,
        createdAt: creationTimestamp,
        lastLogin: lastSignInTimestamp,
    };
}