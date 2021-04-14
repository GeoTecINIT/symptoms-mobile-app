import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
import { ApplicationSettings } from "@nativescript/core";

const LOGGED_IN_KEY = "AUTH_LOGGED_IN";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    get loggedIn$(): Observable<boolean> {
        return this.authSubject.asObservable();
    }

    private authSubject = new ReplaySubject<boolean>(1);

    constructor() {
        const loggedIn = ApplicationSettings.getBoolean(LOGGED_IN_KEY, false);
        this.authSubject.next(loggedIn);
    }

    async login(authCode: string): Promise<boolean> {
        ApplicationSettings.setBoolean(LOGGED_IN_KEY, true);
        this.authSubject.next(true);

        return true;
    }

    async logout(): Promise<void> {
        ApplicationSettings.setBoolean(LOGGED_IN_KEY, false);
        this.authSubject.next(false);
    }
}
