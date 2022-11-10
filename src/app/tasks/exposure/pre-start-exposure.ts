import {
    DispatchableEvent,
    Task,
    TaskOutcome,
    TaskParams,
} from "@awarns/core/tasks";
import {
    Exposure,
    exposures,
    ExposuresStore,
} from "~/app/core/persistence/exposures";
import { AreaOfInterest } from "@awarns/geofencing";
import { PreExposureStarted } from "~/app/tasks/exposure/pre-exposure-start-record";

export class PreStartExposureTask extends Task {
    constructor(private store: ExposuresStore = exposures) {
        super("preStartExposure", { outputEventNames: ["preExposureStarted"] });
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const ongoingExposure = await this.store.getLastUnfinished();
        if (ongoingExposure) {
            throw new Error("There is an exposure already ongoing!");
        }

        const exposure: Exposure = {
            place: invocationEvent.data[0].aoi as AreaOfInterest,
            emotionValues: [],
            successful: false,
        };
        await this.store.insert(exposure);

        return {
            result: new PreExposureStarted(exposure.place),
        };
    }
}
