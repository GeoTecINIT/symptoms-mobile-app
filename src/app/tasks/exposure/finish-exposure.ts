import {
    DispatchableEvent,
    Task,
    TaskOutcome,
    TaskParams,
} from "@awarns/core/tasks";
import { exposures, ExposuresStore } from "~/app/core/persistence/exposures";
import { ExposureChange } from "~/app/tasks/exposure/change-record";
import { Change } from "@awarns/core/entities";

export class FinishExposureTask extends Task {
    constructor(private store: ExposuresStore = exposures) {
        super("finishExposure", {
            outputEventNames: ["exposureFinished"],
        });
    }

    protected async onRun(
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
