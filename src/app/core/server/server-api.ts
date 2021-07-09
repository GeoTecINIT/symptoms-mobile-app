import { GRPCServiceOptions } from "~/app/core/server/common";
import { getConfig } from "~/app/core/config";
import { GRPCAuthInterceptor } from "~/app/core/auth";
import { DevicesApiAdapter } from "./devices";

export interface ServerApiClient {
    devices: DevicesApiAdapter;
}

class ServerApiAdapter {
    get devices() {
        return this.devicesAdapter;
    }

    private readonly devicesAdapter: DevicesApiAdapter;

    constructor(url: string, options: GRPCServiceOptions) {
        this.devicesAdapter = new DevicesApiAdapter(url, options);
    }
}

export const serverApi = new ServerApiAdapter(
    `https://${getConfig().serverHostname}`,
    {
        unaryInterceptors: [new GRPCAuthInterceptor()],
    }
);
