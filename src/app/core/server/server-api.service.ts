import { Injectable } from "@angular/core";
import { serverApi, ServerApiClient } from "./server-api";
import { DevicesApiAdapter } from "./devices";
import { PatientsApiAdapter } from "./patients";
import { TherapistsApiAdapter } from "./therapists";
import { UploadsApiAdapter } from "./uploads";

@Injectable({
    providedIn: "root",
})
export class ServerApiService implements ServerApiClient {
    get devices(): DevicesApiAdapter {
        return serverApi.devices;
    }

    get patients(): PatientsApiAdapter {
        return serverApi.patients;
    }

    get therapists(): TherapistsApiAdapter {
        return serverApi.therapists;
    }

    get uploads(): UploadsApiAdapter {
        return serverApi.uploads;
    }
}
