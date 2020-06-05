import { ProviderInterruption } from "./provider-interrupter";
import { RecordType } from "./record-type";

export interface Provider {
    next(): [Promise<RecordType>, ProviderInterruption];
    checkIfIsReady(): Promise<void>;
    prepare(): Promise<void>;
}
