import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
import { AccountService, AdvancedSettingsService } from "~/app/core/account";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { FirebaseAuthService } from "~/app/core/auth/firebase/firebase-auth.service";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    get loggedIn$(): Observable<boolean> {
        return this.authSubject.asObservable();
    }

    private authSubject = new ReplaySubject<boolean>(1);

    private readonly logger: Logger;

    constructor(
        private accountService: AccountService,
        private advancedSettingsService: AdvancedSettingsService,
        private firebaseAuthService: FirebaseAuthService
    ) {
        this.authSubject.next(this.accountService.deviceProfile.linked);
        this.logger = getLogger("AuthService");
    }

    async login(accessCode: string): Promise<boolean> {
        try {
            await this.accountService.deviceProfile.linkApp(accessCode);
            await this.firebaseAuthService.refreshToken();
            this.authSubject.next(true);

            return true;
        } catch (e) {
            this.logger.warn(`Login error: ${JSON.stringify(e)}`);

            return false;
        }
    }

    async logout(): Promise<void> {
        await this.accountService.deviceProfile.logout();
        await this.advancedSettingsService.reset();
        await this.firebaseAuthService.clearSession();
        this.authSubject.next(false);
    }
}
