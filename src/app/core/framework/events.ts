import { awarns } from "@awarns/core";
import { QuestionnaireAnswers } from "@awarns/notifications";
import { PatientFeedback } from "~/app/core/modals/feedback";

export function emitTreatmentStartEvent() {
    awarns.emitEvent("startEvent");
}

export function emitTreatmentStopEvent() {
    awarns.emitEvent("stopEvent");
}

export function emitPreExposureStartConfirmedEvent(data: any) {
    awarns.emitEvent("preExposureStartConfirmed", data);
}

export function emitExposureStartConfirmedEvent(data: any) {
    awarns.emitEvent("exposureStartConfirmed", data);
}

export function emitPatientDidNotLeaveExposureAreaOnPurposeEvent() {
    awarns.emitEvent("patientDidNotLeaveExposureAreaOnPurpose");
}

export function emitPatientLeftExposureAreaOnPurposeEvent() {
    awarns.emitEvent("patientLeftExposureAreaOnPurpose");
}

export function emitQuestionnaireAnswersAcquiredEvent(
    answers: QuestionnaireAnswers
) {
    awarns.emitEvent("questionnaireAnswersAcquired", answers);
}

export function emitPatientFeedbackAcquiredEvent(feedback: UserFeedback) {
    awarns.emitEvent("patientFeedbackAcquired", feedback);
}

export function emitExposureManuallyFinishedEvent() {
    awarns.emitEvent("exposureManuallyFinished");
}
