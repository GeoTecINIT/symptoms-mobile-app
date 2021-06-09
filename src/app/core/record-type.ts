import { RecordType as EMAIRecordType } from "@geotecinit/emai-framework/entities";

// tslint:disable-next-line:variable-name
export const RecordType = {
    ...EMAIRecordType,
    PatientFeedback: "patient-feedback",
    BatteryLevel: "battery-level",
    ExposureChange: "exposure-change",
    ExposureAreaLeft: "exposure-area-left",
    ExposureAggregate: "exposure-aggregate",
    ExposurePlaceAggregate: "exposure-place-aggregate",
};
