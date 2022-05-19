import { KnownTypes } from "@awarns/core/entities";

// tslint:disable-next-line:variable-name
export const RecordType = {
    ...KnownTypes,
    PatientFeedback: "patient-feedback",
    PreExposureStarted: "pre-exposure-started",
    PreExposureCancelled: "pre-exposure-cancelled",
    ExposureChange: "exposure-change",
    ExposureAreaLeft: "exposure-area-left",
    ExposureAggregate: "exposure-aggregate",
    ExposurePlaceAggregate: "exposure-place-aggregate",
};
