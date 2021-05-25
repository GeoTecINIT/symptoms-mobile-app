import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@geotecinit/emai-framework/tasks";
import { Change } from "@geotecinit/emai-framework/internal/providers";
import { ExposuresStore } from "~/app/core/persistence/exposures";
import { AreaOfInterest } from "@geotecinit/emai-framework/entities/aois";
import { ExposureAreaLeftRecord } from "./exposure-area-left";

export abstract class ExposurePresenceChecker extends TraceableTask {
    protected constructor(
        name: string,
        private outputEvent: string,
        private change: Change,
        private store: ExposuresStore
    ) {
        super(name, {
            outputEventNames: [`${name}Finished`, outputEvent],
        });
    }

    protected async onTracedRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const areasOfInterest = invocationEvent.data as Array<AreaOfInterest>;
        if (!areasOfInterest.length) {
            return { eventName: this.outputEventNames[0] };
        }

        const ongoingExposure = await this.store.getLastUnfinished();
        if (
            !ongoingExposure ||
            !areasOfInterest.includes(ongoingExposure.place)
        ) {
            return { eventName: this.outputEventNames[0] };
        }

        return {
            eventName: this.outputEvent,
            result: new ExposureAreaLeftRecord(
                ongoingExposure.place,
                this.change
            ),
        };
    }
}
