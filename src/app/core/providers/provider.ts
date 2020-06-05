import { ProviderInterruption } from "./provider-interrupter";
import { RecordType, PlatformType } from "./record-type";

export interface Provider {
    provides: PlatformType;
    next(): [Promise<RecordType>, ProviderInterruption];
    checkIfIsReady(): Promise<void>;
    prepare(): Promise<void>;
}
