import {
    GetTherapistRequest,
    TherapistsPromiseClient,
} from "@symptoms/api-client/therapists";
import { GRPCServiceOptions } from "../common";

export interface Therapist {
    id: string;
    fullname: string;
    email: string;
    workPhone?: string;
}

export class TherapistsApiAdapter {
    private readonly client: TherapistsPromiseClient;

    constructor(url: string, options: GRPCServiceOptions) {
        this.client = new TherapistsPromiseClient(url, null, options);
    }

    async get(therapistId: string): Promise<Therapist> {
        const request = new GetTherapistRequest();
        request.setId(therapistId);

        const resp = await this.client.get(request);
        const { id, fullname, email, workPhone } = resp.toObject();

        return { id, fullname, email, workPhone };
    }
}
