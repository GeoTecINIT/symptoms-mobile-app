import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@geotecinit/emai-framework/tasks";
import { exposures, ExposuresStore } from "~/app/core/persistence/exposures";
import { ExposureChange } from "~/app/tasks/exposure/change-record";
import { Change } from "@geotecinit/emai-framework/entities";

export class FinishExposureTask extends TraceableTask {
    constructor(private store: ExposuresStore = exposures) {
        super("finishExposure", {
            outputEventNames: ["exposureFinished"],
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
        const successful = taskParams.successful as boolean;

        ongoingExposure.endTime = new Date();
        ongoingExposure.successful = !!successful;

        await this.store.update(ongoingExposure);

        return {
            result: new ExposureChange(
                Change.END,
                ongoingExposure.endTime,
                ongoingExposure.place,
                ongoingExposure.emotionValues,
                successful
            ),
        };
    }
}
