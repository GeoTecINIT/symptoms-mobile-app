import { Injectable } from "@angular/core";
import { deviceProfile, DeviceProfileStore } from "./device-profile";

@Injectable({
    providedIn: "root",
})
export class AccountService {
    get deviceProfile(): DeviceProfileStore {
        return deviceProfile;
    }
}
