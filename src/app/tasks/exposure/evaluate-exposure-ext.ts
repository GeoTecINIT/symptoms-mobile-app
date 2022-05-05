import {
    DispatchableEvent,
    Task,
    TaskOutcome,
    TaskParams,
} from "@awarns/core/tasks";
import { exposures, ExposuresStore } from "~/app/core/persistence/exposures";
import {
    evaluateLastEmotionValue,
    extractEmotionValuesFromOngoingExposure,
} from "~/app/tasks/exposure/common";

const RESULT_SUCCESSFUL = "exposureExtensionEvaluationResultedSuccessful";
const RESULT_UNSUCCESSFUL = "exposureExtensionEvaluationResultedUnsuccessful";

export class EvaluateExposureExtensionTask extends Task {
    constructor(private store: ExposuresStore = exposures) {
        super("evaluateExposureExtension", {
            outputEventNames: [RESULT_SUCCESSFUL, RESULT_UNSUCCESSFUL],
        });
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const emotionThreshold = taskParams.emotionThreshold as number;

        if (emotionThreshold === undefined) {
            throw new Error("Parameter 'emotionThreshold' is required");
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
            case "above":
                return { eventName: RESULT_UNSUCCESSFUL };
            case "below":
                return { eventName: RESULT_SUCCESSFUL };
        }
    }
}
