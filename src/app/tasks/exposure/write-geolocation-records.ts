import {
    DispatchableEvent,
    Task,
    TaskOutcome,
    TaskParams,
} from "@awarns/core/tasks";
import {
    exposures,
    ExposuresStore,
} from "~/app/core/persistence/exposures";
import { writeRecordsTask } from "@awarns/persistence";

export class WriteGeolocationRecordsTask extends Task {
    constructor(private store: ExposuresStore = exposures) {
        super("writeGeolocationRecords", { outputEventNames: ["writeGeolocationRecordsFinished"] });
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void> {
        const ongoingExposure = await this.store.getLastUnfinished();
        if (!ongoingExposure) return;

        // Only store geolocation when there is an ongoing pre-exposure/exposure
        return writeRecordsTask().run(taskParams, invocationEvent);
    }
}
