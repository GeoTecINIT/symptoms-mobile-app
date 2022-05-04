import { exposures, ExposuresStore } from "~/app/core/persistence/exposures";
import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@awarns/core/tasks";
import { AoIProximityChange } from "@awarns/geofencing";
import { checkIfProximityChangesInvolveOngoingExposure } from "~/app/tasks/exposure/escapes/common";

const TASK_NAME = "checkExposureAreaStatus";
const ENTERED_WITH_NO_ONGOING_EXPOSURE = "enteredAreaWithNoOngoingExposure";
const ENTERED_WITH_PRE_STARTED_EXPOSURE = "enteredAreaWithPreStartedExposure";
const ENTERED_WITH_ONGOING_EXPOSURE = "enteredAreaWithOngoingExposure";

export class ExposureStatusChecker extends TraceableTask {
    constructor(private store: ExposuresStore = exposures) {
        super(TASK_NAME, {
            outputEventNames: [
                `${TASK_NAME}Finished`,
                ENTERED_WITH_NO_ONGOING_EXPOSURE,
                ENTERED_WITH_PRE_STARTED_EXPOSURE,
                ENTERED_WITH_ONGOING_EXPOSURE,
            ],
        });
    }

    protected async onTracedRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const changes = invocationEvent.data as Array<AoIProximityChange>;

        const ongoingExposure = await this.store.getLastUnfinished();
        const result = checkIfProximityChangesInvolveOngoingExposure(
            changes,
            ongoingExposure
        );

        switch (result) {
            case "no-change":
                return { eventName: this.outputEventNames[0] };
            case "not-ongoing":
                return {
                    eventName: ENTERED_WITH_NO_ONGOING_EXPOSURE,
                    result: changes,
                };
            case "pre-started":
                return {
                    eventName: ENTERED_WITH_PRE_STARTED_EXPOSURE,
                    result: changes,
                };
            case "ongoing":
                return {
                    eventName: ENTERED_WITH_ONGOING_EXPOSURE,
                    result: changes,
                };
        }
    }
}
