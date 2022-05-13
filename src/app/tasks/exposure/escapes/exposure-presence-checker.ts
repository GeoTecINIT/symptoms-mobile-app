import {
    DispatchableEvent,
    Task,
    TaskOutcome,
    TaskParams,
} from "@awarns/core/tasks";
import { Change } from "@awarns/core/entities";
import { ExposuresStore } from "~/app/core/persistence/exposures";
import { AoIProximityChange } from "@awarns/geofencing";
import { ExposureAreaLeftRecord } from "./exposure-area-left";
import { checkIfProximityChangesInvolveOngoingExposure } from "~/app/tasks/exposure/escapes/common";

export abstract class ExposurePresenceChecker extends Task {
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

    protected async onRun(
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
            case "not-ongoing":
            case "pre-started":
                return { eventName: this.outputEventNames[0] };
            case "ongoing":
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
