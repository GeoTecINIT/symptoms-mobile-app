import {
    PatientsPromiseClient,
    UpdateConsentRequest as UCRequest,
    GetConsentRequest,
    GetConsentResponse as GCResponse,
    GetPatientRequest,
} from "@symptoms/api-client/patients";
import { GRPCServiceOptions } from "../common";

export interface Patient {
    id: string;
    fileId: string;
    therapistId: string;
    studyId: string;
}
export type UpdateConsentRequest = UCRequest.AsObject;
export type GetConsentResponse = GCResponse.AsObject;

export class PatientsApiAdapter {
    private readonly client: PatientsPromiseClient;

    constructor(url: string, options: GRPCServiceOptions) {
        this.client = new PatientsPromiseClient(url, null, options);
    }

    async get(patientId: string): Promise<Patient> {
        const request = new GetPatientRequest();
        request.setId(patientId);

        const resp = await this.client.get(request);
        const { id, fileId, therapistId, studyId } = resp.toObject();

        return { id, fileId, therapistId, studyId };
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
