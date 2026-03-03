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
        private appSettingsService: AppSettingsService,
    ) {
        console.log("=== BOOT GUARD CONSTRUCTOR ===");
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean> {
        console.log("=== BOOT GUARD CAN ACTIVATE CALLED ===");

        return this.authService.loggedIn$.pipe(
            take(1),
            tap((loggedIn) => {
                console.log(
                    "=== BOOT GUARD RECEIVED LOGGED IN VALUE:",
                    loggedIn,
                    "===",
                );
                this.handleNotLoggedIn(loggedIn);
            }),
        );
    }

    private handleNotLoggedIn(loggedIn: boolean) {
        console.log("=== HANDLE NOT LOGGED IN:", loggedIn, "===");

        if (!loggedIn) {
            console.log("=== NAVIGATING TO /welcome ===");
            this.navigate("/welcome");
            return;
        }

        const setupComplete = this.checkSetupStatus();
        console.log("=== SETUP COMPLETE:", setupComplete, "===");

        if (!setupComplete) {
            console.log("=== NAVIGATING TO /welcome/tutorial ===");
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
