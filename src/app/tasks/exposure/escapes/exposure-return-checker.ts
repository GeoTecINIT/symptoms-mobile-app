import { ExposurePresenceChecker } from "~/app/tasks/exposure/escapes/exposure-presence-checker";
import { exposures, ExposuresStore } from "~/app/core/persistence/exposures";
import { Change } from "@geotecinit/emai-framework/internal/providers";

const TASK_NAME = "checkExposureAreaReturn";
const RETURNED_TO_EXPOSURE_AREA = "returnedToExposureArea";

export class ExposureReturnChecker extends ExposurePresenceChecker {
    constructor(store: ExposuresStore = exposures) {
        super(TASK_NAME, RETURNED_TO_EXPOSURE_AREA, Change.END, store);
    }
}
