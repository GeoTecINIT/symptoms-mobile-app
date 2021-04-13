import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "~/app/views/auth.service";
import { RouterExtensions } from "nativescript-angular/router";
import { take, tap } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class BootGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private routerExtension: RouterExtensions
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
        if (loggedIn) {
            return;
        }
        this.routerExtension.navigate(["/welcome"], { animated: false });
    }
}
