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
    centerId: string;
    therapistId: string;
    startDate: Date;
}
export type UpdateConsentRequest = UCRequest.AsObject;
export type GetConsentResponse = GCResponse.AsObject;

export class PatientsApiAdapter {
    private readonly client: PatientsPromiseClient;

    constructor(url: string, options: GRPCServiceOptions) {
        this.client = new PatientsPromiseClient(url, null, options);
    }

    async get(patientId: string, studyIdReq: string): Promise<Patient> {
        const request = new GetPatientRequest();
        request.setId(patientId);
        request.setStudyId(studyIdReq);

        const resp = await this.client.get(request);
        const { id, centreId, therapistId, startDate } = resp.toObject();
        const milliseconds = startDate.seconds * 1000 + Math.floor(startDate.nanos / 1e6);

        return {
            id,
            centerId: centreId,
            therapistId,
            startDate: new Date(milliseconds)
        } as Patient;
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
