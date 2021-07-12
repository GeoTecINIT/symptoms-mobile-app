import { Injectable } from "@angular/core";
import { deviceProfile, DeviceProfileController } from "./device-profile";
import { patientProfile, PatientProfileController } from "./patient-profile";

@Injectable({
    providedIn: "root",
})
export class AccountService {
    get deviceProfile(): DeviceProfileController {
        return deviceProfile;
    }

    get patientProfile(): PatientProfileController {
        return patientProfile;
    }
}
