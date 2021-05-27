import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@geotecinit/emai-framework/tasks";
import { exposures, ExposuresStore } from "~/app/core/persistence/exposures";

const RESULT_SUCCESS = "exposureEvaluationResultedSuccessful";
const RESULT_NEUTRAL = "exposureEvaluationResultedNeutral";
const RESULT_UNSUCCESSFUL = "exposureEvaluationResultedUnsuccessful";

export class EvaluateExposureTask extends TraceableTask {
    constructor(private store: ExposuresStore = exposures) {
        super("evaluateExposure", {
            outputEventNames: [
                RESULT_SUCCESS,
                RESULT_NEUTRAL,
                RESULT_UNSUCCESSFUL,
            ],
        });
    }

    protected async onTracedRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const emotionThreshold = taskParams.emotionThreshold as number;
        const peakToLastThreshold = taskParams.peakToLastThreshold as number;

        if (
            emotionThreshold === undefined ||
            peakToLastThreshold === undefined
        ) {
            throw new Error(
                "Both 'emotionThreshold' and 'peakToLastThreshold' params are required"
            );
        }

        const ongoingExposure = await this.store.getLastUnfinished();
        if (!ongoingExposure) {
            throw new Error("There is no exposure ongoing!");
        }

        const anxietyLevels = ongoingExposure.emotionValues.map(
            (emotionValue) => emotionValue.value
        );
        if (anxietyLevels.length === 0) {
            return { eventName: RESULT_UNSUCCESSFUL };
        }

        const lastValue = anxietyLevels[anxietyLevels.length - 1];
        if (lastValue < emotionThreshold) {
            return { eventName: RESULT_SUCCESS };
        }

        const peakValue = anxietyLevels.reduce((prev, curr) =>
            curr > prev ? curr : prev
        );
        const peakToLastDiff = peakValue - lastValue;
        if (peakToLastDiff >= peakToLastThreshold) {
            return { eventName: RESULT_NEUTRAL };
        }

        return { eventName: RESULT_UNSUCCESSFUL };
    }
}
