import { exposures, ExposuresStore } from "~/app/core/persistence/exposures";
import {
    DispatchableEvent,
    Task,
    TaskOutcome,
    TaskParams,
} from "@awarns/core/tasks";
import { AoIProximityChange } from "@awarns/geofencing";
import { checkIfProximityChangesInvolveOngoingExposure } from "~/app/tasks/exposure/escapes/common";

const TASK_NAME = "checkPreExposureStatus";
const CLOSE_WITH_NO_ONGOING_EXPOSURE = "approachedAreaWithNoOngoingExposure";
const CLOSE_WITH_ONGOING_EXPOSURE = "approachedAreaWithOngoingExposure";

export class PreExposureStatusChecker extends Task {
    constructor(private store: ExposuresStore = exposures) {
        super(TASK_NAME, {
            outputEventNames: [
                `${TASK_NAME}Finished`,
                CLOSE_WITH_NO_ONGOING_EXPOSURE,
                CLOSE_WITH_ONGOING_EXPOSURE,
            ],
        });
    }

    protected async onRun(
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
                    eventName: CLOSE_WITH_NO_ONGOING_EXPOSURE,
                    result: changes,
                };
            case "pre-started":
            case "ongoing":
                return {
                    eventName: CLOSE_WITH_ONGOING_EXPOSURE,
                    result: changes,
                };
        }
    }
}
