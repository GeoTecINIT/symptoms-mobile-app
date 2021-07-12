import { GRPCServiceOptions } from "~/app/core/server/common";
import { getConfig } from "~/app/core/config";
import { GRPCAuthInterceptor } from "~/app/core/auth";
import { DevicesApiAdapter } from "./devices";
import { PatientsApiAdapter } from "./patients";

export interface ServerApiClient {
    devices: DevicesApiAdapter;
    patients: PatientsApiAdapter;
}

class ServerApiAdapter {
    get devices() {
        return this.devicesAdapter;
    }

    get patients() {
        return this.patientsAdapter;
    }

    private readonly devicesAdapter: DevicesApiAdapter;
    private readonly patientsAdapter: PatientsApiAdapter;

    constructor(url: string, options: GRPCServiceOptions) {
        this.devicesAdapter = new DevicesApiAdapter(url, options);
        this.patientsAdapter = new PatientsApiAdapter(url, options);
    }
}

export const serverApi = new ServerApiAdapter(
    `https://${getConfig().serverHostname}`,
    {
        unaryInterceptors: [new GRPCAuthInterceptor()],
    }
);
