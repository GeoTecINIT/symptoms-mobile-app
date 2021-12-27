import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@geotecinit/emai-framework/tasks";
import { Change } from "@geotecinit/emai-framework/internal/providers";
import { ExposuresStore } from "~/app/core/persistence/exposures";
import { AoIProximityChange } from "@geotecinit/emai-framework/entities/aois";
import { ExposureAreaLeftRecord } from "./exposure-area-left";
import { checkIfProximityChangesInvolveOngoingExposure } from "~/app/tasks/exposure/escapes/common";

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
        const changes = invocationEvent.data as Array<AoIProximityChange>;

        const ongoingExposure = await this.store.getLastUnfinished(true);
        const result = checkIfProximityChangesInvolveOngoingExposure(
            changes,
            ongoingExposure
        );

        switch (result) {
            case "no-change":
            case "not-present":
                return { eventName: this.outputEventNames[0] };
            case "present":
                return {
                    eventName: this.outputEvent,
                    result: new ExposureAreaLeftRecord(
                        ongoingExposure.place,
                        this.change
                    ),
                };
        }
    }
}
