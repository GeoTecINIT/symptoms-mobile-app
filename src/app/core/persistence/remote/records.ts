import { RecordsStore } from "@geotecinit/emai-framework/storage/records";
import { Record } from "@geotecinit/emai-framework/entities";
import { Observable } from "rxjs";
import { serverApi, ServerApiClient } from "~/app/core/server";
import { account, Account } from "~/app/core/account";
import { getUploadMetadata } from "~/app/core/persistence/remote/common";

class RemoteRecordsStore implements RecordsStore {
    constructor(
        private accountInfo: Account,
        private serverClient: ServerApiClient
    ) {}

    async insert(record: Record): Promise<void> {
        const { patientId, studyId, deviceId } = await getUploadMetadata(
            this.accountInfo
        );

        await this.serverClient.uploads.uploadRecords(patientId, studyId, [
            { ...record, deviceId },
        ]);
    }

    getAll(reverseOrder?: boolean, limitSize?: number): Promise<Array<Record>> {
        throw new Error("Unimplemented");
    }

    list(size?: number): Observable<Array<Record>> {
        throw new Error("Unimplemented");
    }

    clear(): Promise<void> {
        throw new Error("Unimplemented");
    }
}

export const remoteRecords = new RemoteRecordsStore(account, serverApi);
