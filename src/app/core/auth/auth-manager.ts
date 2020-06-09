import { FirebaseManager, firebaseManager } from "../utils/firebase";
import { Logger, getLogger } from "../utils/logger";

class AuthManager implements AuthManager {
    private logger: Logger;
    private firebaseManager: FirebaseManager;
    private initPromise: Promise<any>;
    private initialized = false;

    constructor() {
        this.logger = getLogger("AuthManager");
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
        const sessionData = this.sessionDataFromUser(user);
        this.logger.info(`Logged in as: ${JSON.stringify(sessionData)}`);
        this.firebaseManager.crashlytics().then((crashlytics) => {
            if (crashlytics) {
                crashlytics.setUserId(sessionData.id);
            }
        });
        this.initialized = true;
    }

    async sessionData(): Promise<SessionData> {
        await this.init();
        const firebase = await this.firebaseManager.getInstance();
        await firebase.reloadUser();
        const user = await firebase.getCurrentUser();

        return this.sessionDataFromUser(user);
    }

    private sessionDataFromUser(user: any): SessionData {
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
}

export const authManager = new AuthManager();

export interface SessionData {
    id: string;
    isNew: boolean;
    createdAt: Date;
    lastLogin: Date;
}
