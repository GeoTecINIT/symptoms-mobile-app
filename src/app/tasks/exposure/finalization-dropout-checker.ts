import {
    DispatchableEvent,
    Task,
    TaskOutcome,
    TaskParams,
} from "@awarns/core/tasks";
import { ExposureChange } from "~/app/tasks/exposure";

const EXPOSURE_DROPPED_OUT = "exposureWasDroppedOut";
const EXPOSURE_NOT_DROPPED_OUT = "exposureWasNotDroppedOut";

export class ExposureFinalizationDropoutChecker extends Task {
    constructor() {
        super("checkIfExposureWasDroppedOut", {
            outputEventNames: [EXPOSURE_DROPPED_OUT, EXPOSURE_NOT_DROPPED_OUT],
        });
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const exposureChange = invocationEvent.data as ExposureChange;
        if (exposureChange.successful) {
            return {
                eventName: EXPOSURE_NOT_DROPPED_OUT,
                result: exposureChange,
            };
        } else {
            return { eventName: EXPOSURE_DROPPED_OUT, result: exposureChange };
        }
    }
}
