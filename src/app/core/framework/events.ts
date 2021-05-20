import { emaiFramework } from "@geotecinit/emai-framework";

export function emitTreatmentStartEvent() {
    emaiFramework.emitEvent("startEvent");
}

export function emitTreatmentStopEvent() {
    emaiFramework.emitEvent("stopEvent");
}

export function emitExposureStartConfirmedEvent() {
    emaiFramework.emitEvent("exposureStartConfirmed");
}
