import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@awarns/core/tasks";
import { exposures, ExposuresStore } from "~/app/core/persistence/exposures";
import { PreExposureCancelled } from "~/app/tasks/exposure/pre-exposure-cancelled-record";

export class CancelPreExposureTask extends TraceableTask {
    constructor(private store: ExposuresStore = exposures) {
        super("cancelPreExposure", {
            outputEventNames: ["preExposureCancelled"],
        });
    }

    protected async onTracedRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const ongoingExposure = await this.store.getLastUnfinished();
        if (!ongoingExposure) {
            throw new Error("There is no exposure ongoing!");
        }
        if (ongoingExposure.startTime) {
            throw new Error(
                "Ongoing exposure was already started. Pre-exposure already finished!"
            );
        }

        await this.store.remove(ongoingExposure.id);

        return {
            result: new PreExposureCancelled(ongoingExposure.place),
        };
    }
}
