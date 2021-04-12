import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    async login(authCode: string): Promise<boolean> {
        return true;
    }
}
