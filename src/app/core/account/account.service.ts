import { Injectable } from "@angular/core";
import { account, Account } from "./account";
import { DeviceProfileController } from "./device-profile";
import { PatientProfileController } from "./patient-profile";

@Injectable({
    providedIn: "root",
})
export class AccountService implements Account {
    get deviceProfile(): DeviceProfileController {
        return account.deviceProfile;
    }

    get patientProfile(): PatientProfileController {
        return account.patientProfile;
    }

    reset() {
        account.reset();
    }
}
