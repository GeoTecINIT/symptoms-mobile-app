import { emaiFramework } from "@geotecinit/emai-framework";
import { QuestionnaireAnswers } from "@geotecinit/emai-framework/entities/answers";

export function emitTreatmentStartEvent() {
    emaiFramework.emitEvent("startEvent");
}

export function emitTreatmentStopEvent() {
    emaiFramework.emitEvent("stopEvent");
}

export function emitExposureStartConfirmedEvent(data: any) {
    emaiFramework.emitEvent("exposureStartConfirmed", data);
}

export function emitQuestionnaireAnswersAcquired(
    answers: QuestionnaireAnswers
) {
    emaiFramework.emitEvent("questionnaireAnswersAcquired", answers);
}
