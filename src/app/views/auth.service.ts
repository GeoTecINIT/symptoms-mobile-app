import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
import { ServerApiService } from "~/app/core/server";
import { AccountService } from "~/app/core/account";
import { getDeviceInfo, getPackageName } from "~/app/core/utils/app-info";
import { getLogger, Logger } from "~/app/core/utils/logger";

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
        private serverApiService: ServerApiService,
        private accountService: AccountService
    ) {
        this.authSubject.next(this.accountService.deviceProfile.linked);
        this.logger = getLogger("AuthService");
    }

    async login(accessCode: string): Promise<boolean> {
        const appId = getPackageName();
        const { os, osVersion, manufacturer, model } = getDeviceInfo();
        try {
            const resp = await this.serverApiService.devices.linkApp({
                accessCode,
                appId,
                os,
                osVersion,
                manufacturer,
                model,
            });
            this.accountService.deviceProfile.load(resp);
            this.authSubject.next(true);

            return true;
        } catch (e) {
            this.logger.warn(`Login error: ${JSON.stringify(e)}`);

            return false;
        }
    }

    async logout(): Promise<void> {
        this.accountService.deviceProfile.clear();
        this.authSubject.next(false);
    }
}
