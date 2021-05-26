import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@geotecinit/emai-framework/tasks";
import { exposures, ExposuresStore } from "~/app/core/persistence/exposures";
import { AoIProximityChange } from "@geotecinit/emai-framework/entities/aois";
import { checkIfProximityChangesInvolveOngoingExposure } from "~/app/tasks/exposure/escapes/common";

const TASK_NAME = "checkExposureAreaStatus";
const ENTERED_WITH_NO_ONGOING_EXPOSURE = "enteredAreaWithNoOngoingExposure";
const ENTERED_WITH_ONGOING_EXPOSURE = "enteredAreaWithOngoingExposure";

export class ExposureStatusChecker extends TraceableTask {
    constructor(private store: ExposuresStore = exposures) {
        super(TASK_NAME, {
            outputEventNames: [
                `${TASK_NAME}Finished`,
                ENTERED_WITH_NO_ONGOING_EXPOSURE,
                ENTERED_WITH_ONGOING_EXPOSURE,
            ],
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
                return { eventName: this.outputEventNames[0] };
            case "not-present":
                return {
                    eventName: ENTERED_WITH_NO_ONGOING_EXPOSURE,
                    result: changes,
                };
            case "present":
                return {
                    eventName: ENTERED_WITH_ONGOING_EXPOSURE,
                    result: changes,
                };
        }
    }
}
