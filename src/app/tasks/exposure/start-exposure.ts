import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@geotecinit/emai-framework/tasks";
import {
    Exposure,
    exposures,
    ExposuresStore,
} from "~/app/core/persistence/exposures";
import { ExposureChange } from "./change-record";
import { Change } from "@geotecinit/emai-framework/entities";
import { AreaOfInterest } from "@geotecinit/emai-framework/entities/aois";

export class StartExposureTask extends TraceableTask {
    constructor(private store: ExposuresStore = exposures) {
        super("startExposure", { outputEventNames: ["exposureStarted"] });
    }

    protected async onTracedRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const ongoingExposure = await this.store.getLastUnfinished();
        if (ongoingExposure) {
            throw new Error("There is an exposure already ongoing!");
        }

        const exposure: Exposure = {
            startTime: new Date(),
            place: invocationEvent.data[0].aoi as AreaOfInterest,
            emotionValues: [],
            successful: false,
        };
        await this.store.insert(exposure);

        return {
            result: new ExposureChange(
                Change.START,
                exposure.startTime,
                exposure.place,
                exposure.emotionValues
            ),
        };
    }
}
