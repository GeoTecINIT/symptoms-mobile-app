import {
    DevicesPromiseClient,
    LinkAppRequest as LARequest,
    LinkAppResponse as LAResponse,
} from "@symptoms/api-client/devices";
import { GRPCServiceOptions } from "../common";

export type LinkAppRequest = LARequest.AsObject;
export type LinkAppResponse = LAResponse.AsObject;

export class DevicesApiAdapter {
    private readonly client: DevicesPromiseClient;

    constructor(hostname: string, options: GRPCServiceOptions) {
        this.client = new DevicesPromiseClient(hostname, null, options);
    }

    async linkApp(req: LinkAppRequest): Promise<LinkAppResponse> {
        const request = new LARequest();
        request.setAccessCode(req.accessCode);
        request.setAppId(req.appId);
        request.setOs(req.os);
        request.setManufacturer(req.manufacturer);
        request.setModel(req.model);

        const resp = await this.client.linkApp(request);

        return resp.toObject();
    }
}
