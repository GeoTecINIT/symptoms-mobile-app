import { emaiFramework } from "@geotecinit/emai-framework";
import { QuestionnaireAnswers } from "@geotecinit/emai-framework/entities/answers";
import { PatientFeedback } from "~/app/core/modals/feedback";

export function emitTreatmentStartEvent() {
    emaiFramework.emitEvent("startEvent");
}

export function emitTreatmentStopEvent() {
    emaiFramework.emitEvent("stopEvent");
}

export function emitPreExposureStartConfirmedEvent(data: any) {
    emaiFramework.emitEvent("preExposureStartConfirmed", data);
}

export function emitExposureStartConfirmedEvent(data: any) {
    emaiFramework.emitEvent("exposureStartConfirmed", data);
}

export function emitPatientDidNotLeaveExposureAreaOnPurposeEvent() {
    emaiFramework.emitEvent("patientDidNotLeaveExposureAreaOnPurpose");
}

export function emitPatientLeftExposureAreaOnPurposeEvent() {
    emaiFramework.emitEvent("patientLeftExposureAreaOnPurpose");
}

export function emitQuestionnaireAnswersAcquiredEvent(
    answers: QuestionnaireAnswers
) {
    emaiFramework.emitEvent("questionnaireAnswersAcquired", answers);
}

export function emitPatientFeedbackAcquiredEvent(feedback: PatientFeedback) {
    emaiFramework.emitEvent("patientFeedbackAcquired", feedback);
}

export function emitExposureManuallyFinishedEvent() {
    emaiFramework.emitEvent("exposureManuallyFinished");
}
