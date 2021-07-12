import {
    PatientsPromiseClient,
    UpdateConsentRequest as UCRequest,
    GetConsentRequest,
    GetConsentResponse as GCResponse,
} from "@symptoms/api-client/patients";
import { GRPCServiceOptions } from "../common";

export type UpdateConsentRequest = UCRequest.AsObject;

export type GetConsentResponse = GCResponse.AsObject;

export class PatientsApiAdapter {
    private readonly client: PatientsPromiseClient;

    constructor(url: string, options: GRPCServiceOptions) {
        this.client = new PatientsPromiseClient(url, null, options);
    }

    async updateConsent(req: UpdateConsentRequest): Promise<void> {
        const request = new UCRequest();
        request.setDataSharing(req.dataSharing);

        await this.client.updateConsent(request);
    }

    async getConsent(): Promise<GetConsentResponse> {
        const resp = await this.client.getConsent(new GetConsentRequest());

        return resp.toObject();
    }
}
