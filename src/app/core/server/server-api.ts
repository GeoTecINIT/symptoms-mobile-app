import { GRPCServiceOptions } from "~/app/core/server/common";
import { getConfig } from "~/app/core/config";
import { GRPCAuthInterceptor } from "~/app/core/auth";
import { DevicesApiAdapter } from "./devices";
import { PatientsApiAdapter } from "./patients";
import { TherapistsApiAdapter } from "./therapists";
import { UploadsApiAdapter } from "./uploads";
import { GRPCDeadlineInterceptor } from "~/app/core/server/grpc-deadline-interceptor";

export interface ServerApiClient {
    devices: DevicesApiAdapter;
    patients: PatientsApiAdapter;
    therapists: TherapistsApiAdapter;
    uploads: UploadsApiAdapter;
}

class ServerApiAdapter implements ServerApiClient {
    get devices() {
        return this.devicesAdapter;
    }

    get patients() {
        return this.patientsAdapter;
    }

    get therapists() {
        return this.therapistsAdapter;
    }

    get uploads() {
        return this.uploadsAdapter;
    }

    private readonly devicesAdapter: DevicesApiAdapter;
    private readonly patientsAdapter: PatientsApiAdapter;
    private readonly therapistsAdapter: TherapistsApiAdapter;
    private readonly uploadsAdapter: UploadsApiAdapter;

    constructor(url: string, options: GRPCServiceOptions) {
        this.devicesAdapter = new DevicesApiAdapter(url, options);
        this.patientsAdapter = new PatientsApiAdapter(url, options);
        this.therapistsAdapter = new TherapistsApiAdapter(url, options);
        this.uploadsAdapter = new UploadsApiAdapter(url, options);
    }
}

export const serverApi = new ServerApiAdapter(
    `https://${getConfig().serverHostname}`,
    {
        unaryInterceptors: [
            new GRPCAuthInterceptor(),
            new GRPCDeadlineInterceptor(),
        ],
    }
);
