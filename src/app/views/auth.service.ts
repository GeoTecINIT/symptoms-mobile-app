import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
import { getBoolean, setBoolean } from "tns-core-modules/application-settings";

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
        const loggedIn = getBoolean(LOGGED_IN_KEY, false);
        this.authSubject.next(loggedIn);
    }

    async login(authCode: string): Promise<boolean> {
        setBoolean(LOGGED_IN_KEY, true);
        this.authSubject.next(true);

        return true;
    }
}
