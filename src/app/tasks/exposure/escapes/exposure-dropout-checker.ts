import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@geotecinit/emai-framework/tasks";
import { exposures, ExposuresStore } from "~/app/core/persistence/exposures";
import { AoIProximityChange } from "@geotecinit/emai-framework/entities/aois";
import { checkIfProximityChangesInvolveOngoingExposure } from "~/app/tasks/exposure/escapes/common";

const TASK_NAME = "checkExposureDropout";
const EXPOSURE_DROPPED_OUT = "exposureDroppedOut";

export class ExposureDropoutChecker extends TraceableTask {
    constructor(private store: ExposuresStore = exposures) {
        super("checkExposureDropout", {
            outputEventNames: [`${TASK_NAME}Finished`, EXPOSURE_DROPPED_OUT],
        });
    }

    protected async onTracedRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const changes = invocationEvent.data as Array<AoIProximityChange>;
        const result = await checkIfProximityChangesInvolveOngoingExposure(
            changes,
            this.store
        );
        switch (result) {
            case "no-change":
            case "not-present":
                return { eventName: this.outputEventNames[0] };
            case "present":
                return { eventName: EXPOSURE_DROPPED_OUT };
        }
    }
}
