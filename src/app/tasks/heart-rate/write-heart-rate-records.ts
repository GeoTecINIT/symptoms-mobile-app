import {
    DispatchableEvent,
    Task,
    TaskParams,
} from "@awarns/core/tasks";
import {
    exposures,
    ExposuresStore,
} from "~/app/core/persistence/exposures";
import { writeRecordsTask } from "@awarns/persistence";

export class WriteHeartRateRecordsTask extends Task {
    constructor(private store: ExposuresStore = exposures) {
        super("writeHeartRateRecords", { outputEventNames: ["writeHeartRateRecordsFinished"] });
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void> {
        const ongoingExposure = await this.store.getLastUnfinished();
        if (!ongoingExposure) return;
        
        // Add exposureId field in the heart rate record 
        const data = { ...invocationEvent.data, exposureId: ongoingExposure.id }
        
        return writeRecordsTask().run(taskParams, { ...invocationEvent, data });
    }
}
