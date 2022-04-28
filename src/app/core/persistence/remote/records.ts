import { RecordsStore } from "@awarns/core/storage/records";
import { Record } from "@awarns/core/entities";
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

    getAll(_reverseOrder?: boolean, _limitSize?: number): Promise<Array<Record>> {
        throw new Error("Unimplemented");
    }

    list(_size?: number): Observable<Array<Record>> {
        throw new Error("Unimplemented");
    }

    clear(): Promise<void> {
        throw new Error("Unimplemented");
    }
}

export const remoteRecords = new RemoteRecordsStore(account, serverApi);
