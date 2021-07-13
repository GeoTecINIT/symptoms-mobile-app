import { Trace, TracesStore } from "@geotecinit/emai-framework/storage/traces";
import { Observable } from "rxjs";
import { account, Account } from "~/app/core/account";
import { serverApi, ServerApiClient } from "~/app/core/server";
import { getUploadMetadata } from "~/app/core/persistence/remote/common";

class RemoteTracesStore implements TracesStore {
    constructor(
        private accountInfo: Account,
        private serverClient: ServerApiClient
    ) {}

    async insert(trace: Trace): Promise<void> {
        const { patientId, studyId, deviceId } = await getUploadMetadata(
            this.accountInfo
        );

        await this.serverClient.uploads.uploadTraces(patientId, studyId, [
            {
                ...trace,
                deviceId,
            },
        ]);
    }

    getAll(reverseOrder?: boolean, limitSize?: number): Promise<Array<Trace>> {
        throw new Error("Unimplemented");
    }

    list(size?: number): Observable<Array<Trace>> {
        throw new Error("Unimplemented");
    }

    clear(): Promise<void> {
        throw new Error("Unimplemented");
    }
}

export const remoteTraces = new RemoteTracesStore(account, serverApi);
