import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@geotecinit/emai-framework/tasks";
import { ExposuresStore } from "~/app/core/persistence/exposures";
import { AoIProximityChange } from "@geotecinit/emai-framework/entities/aois";
import { checkIfProximityChangesInvolveOngoingExposure } from "~/app/tasks/exposure/escapes/common";

export abstract class AbstractExposureStatusChecker extends TraceableTask {
    protected constructor(
        taskName: string,
        private onGoingEvtName: string,
        private noOngoingEvtName: string,
        private store: ExposuresStore
    ) {
        super(taskName, {
            outputEventNames: [
                `${taskName}Finished`,
                noOngoingEvtName,
                onGoingEvtName,
            ],
        });
    }

    protected async onTracedRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const changes = invocationEvent.data as Array<AoIProximityChange>;

        const ongoingExposure = await this.store.getLastUnfinished();
        const result = checkIfProximityChangesInvolveOngoingExposure(
            changes,
            ongoingExposure
        );

        switch (result) {
            case "no-change":
                return { eventName: this.outputEventNames[0] };
            case "not-present":
                return {
                    eventName: this.noOngoingEvtName,
                    result: changes,
                };
            case "present":
                return {
                    eventName: this.onGoingEvtName,
                    result: changes,
                };
        }
    }
}
