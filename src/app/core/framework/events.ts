import { awarns } from "@awarns/core";
import {
    QuestionnaireAnswers,
    UserConfirmation,
    UserFeedback,
    UserReadContent,
} from "@awarns/notifications";

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

export function emitPatientConfirmationAcquiredEvent(
    confirmation: UserConfirmation
) {
    awarns.emitEvent("patientConfirmationAcquired", confirmation);
}

export function emitPatientReadContentAcquiredEvent(
    contentRead: UserReadContent
) {
    awarns.emitEvent("patientReadContentAcquired", contentRead);
}

export function emitExposureManuallyFinishedEvent() {
    awarns.emitEvent("exposureManuallyFinished");
}
