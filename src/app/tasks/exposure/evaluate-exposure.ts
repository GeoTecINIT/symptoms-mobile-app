import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@awarns/core/tasks";
import { exposures, ExposuresStore } from "~/app/core/persistence/exposures";
import {
    evaluateLastEmotionValue,
    extractEmotionValuesFromOngoingExposure,
} from "~/app/tasks/exposure/common";

const RESULT_SUCCESSFUL = "exposureEvaluationResultedSuccessful";
const RESULT_NEUTRAL = "exposureEvaluationResultedNeutral";
const RESULT_UNSUCCESSFUL = "exposureEvaluationResultedUnsuccessful";

export class EvaluateExposureTask extends TraceableTask {
    constructor(private store: ExposuresStore = exposures) {
        super("evaluateExposure", {
            outputEventNames: [
                RESULT_SUCCESSFUL,
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

        const emotionValues = await extractEmotionValuesFromOngoingExposure(
            this.store
        );
        const evaluationResult = evaluateLastEmotionValue(
            emotionValues,
            emotionThreshold
        );
        switch (evaluationResult) {
            case "not-enough":
                return { eventName: RESULT_UNSUCCESSFUL };
            case "below":
                return { eventName: RESULT_SUCCESSFUL };
        }

        const peakValue = emotionValues.reduce((prev, curr) =>
            curr > prev ? curr : prev
        );
        const lastValue = emotionValues[emotionValues.length - 1];

        const peakToLastDiff = peakValue - lastValue;
        if (peakToLastDiff >= peakToLastThreshold) {
            return { eventName: RESULT_NEUTRAL };
        }

        return { eventName: RESULT_UNSUCCESSFUL };
    }
}
