import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@awarns/core/tasks";
import {
    Exposure,
    exposures,
    ExposuresStore,
} from "~/app/core/persistence/exposures";
import { ExposureChange } from "./change-record";
import { Change } from "@awarns/core/entities";
import { AreaOfInterest } from "@awarns/geofencing";

export class StartExposureTask extends TraceableTask {
    constructor(private store: ExposuresStore = exposures) {
        super("startExposure", { outputEventNames: ["exposureStarted"] });
    }

    protected async onTracedRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const place = invocationEvent.data[0].aoi as AreaOfInterest;
        const ongoingExposure = await this.store.getLastUnfinished();

        if (ongoingExposure) {
            if (ongoingExposure.startTime) {
                throw new Error("There is an exposure already ongoing!");
            } else if (ongoingExposure.place.id !== place.id) {
                throw new Error(
                    "There is a pre-started exposure somewhere else!"
                );
            }
        }

        let exposure: Exposure;
        if (!ongoingExposure) {
            exposure = {
                startTime: new Date(),
                place,
                emotionValues: [],
                successful: false,
            };
            await this.store.insert(exposure);
        } else {
            exposure = { ...ongoingExposure, startTime: new Date() };
            await this.store.update(exposure);
        }

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
