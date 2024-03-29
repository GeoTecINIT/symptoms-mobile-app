import {
    DispatchableEvent,
    Task,
    TaskOutcome,
    TaskParams,
} from "@awarns/core/tasks";
import { exposures, ExposuresStore } from "~/app/core/persistence/exposures";
import { AoIProximityChange } from "@awarns/geofencing";
import { checkIfProximityChangesInvolveOngoingExposure } from "~/app/tasks/exposure/escapes/common";

const TASK_NAME = "checkExposureDropout";
const EXPOSURE_DROPPED_OUT = "exposureDroppedOut";

export class ExposureDropoutChecker extends Task {
    constructor(private store: ExposuresStore = exposures) {
        super("checkExposureDropout", {
            outputEventNames: [`${TASK_NAME}Finished`, EXPOSURE_DROPPED_OUT],
        });
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const changes = invocationEvent.data as Array<AoIProximityChange>;
        const ongoingExposure = await this.store.getLastUnfinished(true);
        const result = checkIfProximityChangesInvolveOngoingExposure(
            changes,
            ongoingExposure
        );
        switch (result) {
            case "no-change":
            case "not-ongoing":
            case "pre-started":
                return { eventName: this.outputEventNames[0] };
            case "ongoing":
                return { eventName: EXPOSURE_DROPPED_OUT };
        }
    }
}
