import { exposures, ExposuresStore } from "~/app/core/persistence/exposures";
import { AbstractExposureStatusChecker } from "~/app/tasks/exposure/escapes/abstract-exposure-status-checker";

const TASK_NAME = "checkPreExposureStatus";
const CLOSE_WITH_NO_ONGOING_EXPOSURE = "approachedAreaWithNoOngoingExposure";
const CLOSE_WITH_ONGOING_EXPOSURE = "approachedAreaWithOngoingExposure";

export class PreExposureStatusChecker extends AbstractExposureStatusChecker {
    constructor(store: ExposuresStore = exposures) {
        super(
            TASK_NAME,
            CLOSE_WITH_ONGOING_EXPOSURE,
            CLOSE_WITH_NO_ONGOING_EXPOSURE,
            store
        );
    }
}
