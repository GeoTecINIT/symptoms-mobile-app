import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    RouterStateSnapshot,
} from "@angular/router";

import { AuthService } from "./auth.service";
import { NavigationService } from "./navigation.service";
import { AppSettingsService } from "./app-settings.service";

import { Observable } from "rxjs";
import { take, tap } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class BootGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private navigationService: NavigationService,
        private appSettingsService: AppSettingsService
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.authService.loggedIn$.pipe(
            take(1),
            tap((loggedIn) => this.handleNotLoggedIn(loggedIn))
        );
    }

    private handleNotLoggedIn(loggedIn: boolean) {
        if (!loggedIn) {
            this.navigate("/welcome");

            return;
        }

        const setupComplete = this.checkSetupStatus();
        if (!setupComplete) {
            this.navigate("/welcome/tutorial");
        }
    }

    private navigate(route: string) {
        this.navigationService.forceNavigate([route]);
    }

    private checkSetupStatus() {
        return this.appSettingsService.isSetupComplete();
    }
}
