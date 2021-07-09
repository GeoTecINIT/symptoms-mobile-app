import { Injectable } from "@angular/core";
import { serverApi, ServerApiClient } from "~/app/core/server/server-api";
import { DevicesApiAdapter } from "~/app/core/server/devices";

@Injectable({
    providedIn: "root",
})
export class ServerApiService implements ServerApiClient {
    get devices(): DevicesApiAdapter {
        return serverApi.devices;
    }
}
