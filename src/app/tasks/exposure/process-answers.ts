import {
    DispatchableEvent,
    Task,
    TaskOutcome,
    TaskParams,
} from "@awarns/core/tasks";
import { exposures, ExposuresStore } from "~/app/core/persistence/exposures";
import { QuestionnaireAnswers } from "@awarns/notifications";

export class ProcessExposureAnswers extends Task {
    constructor(private store: ExposuresStore = exposures) {
        super("processExposureAnswers", {
            outputEventNames: ["exposureAnswersProcessed"],
        });
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const questionnaireAnswers =
            invocationEvent.data as QuestionnaireAnswers;
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
