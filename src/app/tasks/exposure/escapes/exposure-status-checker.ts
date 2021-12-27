import { exposures, ExposuresStore } from "~/app/core/persistence/exposures";
import { AbstractExposureStatusChecker } from "~/app/tasks/exposure/escapes/abstract-exposure-status-checker";

const TASK_NAME = "checkExposureAreaStatus";
const ENTERED_WITH_NO_ONGOING_EXPOSURE = "enteredAreaWithNoOngoingExposure";
const ENTERED_WITH_ONGOING_EXPOSURE = "enteredAreaWithOngoingExposure";

export class ExposureStatusChecker extends AbstractExposureStatusChecker {
    constructor(store: ExposuresStore = exposures) {
        super(
            TASK_NAME,
            ENTERED_WITH_ONGOING_EXPOSURE,
            ENTERED_WITH_NO_ONGOING_EXPOSURE,
            store
        );
    }
}
