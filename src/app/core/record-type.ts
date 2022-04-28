import { RecordType as AwarnsRecordType } from "@awarns/core/entities";

// tslint:disable-next-line:variable-name
export const RecordType = {
    ...AwarnsRecordType,
    PatientFeedback: "patient-feedback",
    BatteryLevel: "battery-level",
    PreExposureStarted: "pre-exposure-started",
    PreExposureCancelled: "pre-exposure-cancelled",
    ExposureChange: "exposure-change",
    ExposureAreaLeft: "exposure-area-left",
    ExposureAggregate: "exposure-aggregate",
    ExposurePlaceAggregate: "exposure-place-aggregate",
};
