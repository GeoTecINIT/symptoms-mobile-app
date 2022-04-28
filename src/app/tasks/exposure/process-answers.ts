import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@awarns/core/tasks";
import { exposures, ExposuresStore } from "~/app/core/persistence/exposures";
import { QuestionnaireAnswers } from "@awarns/core/entities/answers";

export class ProcessExposureAnswers extends TraceableTask {
    constructor(private store: ExposuresStore = exposures) {
        super("processExposureAnswers", {
            outputEventNames: ["exposureAnswersProcessed"],
        });
    }

    protected async onTracedRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const questionnaireAnswers = invocationEvent.data as QuestionnaireAnswers;
        const ongoingExposure = await this.store.getLastUnfinished();
        if (!ongoingExposure) {
            throw new Error("There is no exposure ongoing!");
        }

        const anxietyLevel = questionnaireAnswers.answers[0].answer as number;
        ongoingExposure.emotionValues.push({
            value: anxietyLevel,
            timestamp: questionnaireAnswers.timestamp,
        });
        await this.store.update(ongoingExposure);

        return { result: ongoingExposure };
    }
}
