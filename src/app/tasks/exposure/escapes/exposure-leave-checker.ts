import { exposures, ExposuresStore } from "~/app/core/persistence/exposures";
import { Change } from "@geotecinit/emai-framework/internal/providers";
import { ExposurePresenceChecker } from "~/app/tasks/exposure/escapes/exposure-presence-checker";

const TASK_NAME = "checkExposureAreaLeft";
const EXPOSURE_AREA_LEFT = "exposureAreaLeft";

export class ExposureLeaveChecker extends ExposurePresenceChecker {
    constructor(store: ExposuresStore = exposures) {
        super(TASK_NAME, EXPOSURE_AREA_LEFT, Change.START, store);
    }
}
