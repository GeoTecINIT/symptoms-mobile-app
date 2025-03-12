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
import { ExposureChange } from "./change-record";
import { Change } from "@awarns/core/entities";
import { AreaOfInterest } from "@awarns/geofencing";
import { ContextualConditions, WeatherSummary } from "~/app/core/weather";

export class StartExposureTask extends Task {
    constructor(private store: ExposuresStore = exposures) {
        super("startExposure", { outputEventNames: ["exposureStarted"] });
    }

    protected async onRun(
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

        const contextualConditions: ContextualConditions =
            invocationEvent.data[0].contextualConditions;
        const weatherSummary: WeatherSummary =
            invocationEvent.data[0].weatherSummary;

        let exposure: Exposure;
        let exposureId: string;

        if (!ongoingExposure) {
            exposure = {
                startTime: new Date(),
                place,
                emotionValues: [],
                successful: false,
                ...(contextualConditions && { contextualConditions }), // short-circuit object construction
                ...(weatherSummary && { weatherSummary }),
                toleranceValues: [],
            };
            exposureId = await this.store.insert(exposure);
        } else {
            exposureId = ongoingExposure.id;
            exposure = {
                ...ongoingExposure,
                startTime: new Date(),
                ...(contextualConditions && { contextualConditions }), // short-circuit object construction
                ...(weatherSummary && { weatherSummary }),
            };
            await this.store.update(exposure);
        }

        return {
            result: new ExposureChange(
                Change.START,
                exposure.startTime,
                exposureId,
                exposure.place,
                exposure.emotionValues,
                false,
                contextualConditions,
                weatherSummary,
                exposure.toleranceValues
            ),
        };
    }
}
