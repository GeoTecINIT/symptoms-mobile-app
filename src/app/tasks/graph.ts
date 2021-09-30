import { getConfig } from "~/app/core/config";

import {
    TaskGraph,
    EventListenerGenerator,
    RunnableTaskDescriptor,
} from "@geotecinit/emai-framework/tasks/graph";
import { TapActionType } from "@geotecinit/emai-framework/notifications";

const exposureTimes = getConfig().exposureTimes;
const EXPOSURE_TIME = exposureTimes.regular;
const EXPOSURE_EXTENSION_TIME = exposureTimes.extension;

class DemoTaskGraph implements TaskGraph {
    async describe(
        on: EventListenerGenerator,
        run: RunnableTaskDescriptor
    ): Promise<void> {
        // START: Human activity recognition
        on("startEvent", run("startDetectingCoarseHumanActivityChanges"));
        on("stopEvent", run("stopDetectingCoarseHumanActivityChanges"));
        // END: Human activity recognition

        // START: Low resolution geolocation data collection
        // -> Low frequency
        on(
            "startEvent",
            run("emitLowFrequencyGeolocationAcquisitionCanStartEvent")
        );
        on(
            "userStartedBeingStill",
            run("emitLowFrequencyGeolocationAcquisitionCanStartEvent")
        );
        on(
            "userFinishedBeingStill",
            run("emitLowFrequencyGeolocationAcquisitionCanStopEvent")
        );
        on(
            "stopEvent",
            run("emitLowFrequencyGeolocationAcquisitionCanStopEvent")
        );
        on(
            "lowFrequencyGeolocationAcquisitionCanStart",
            run("acquirePhoneGeolocation")
                .every(15, "minutes")
                .cancelOn("lowFrequencyGeolocationAcquisitionCanStop")
        );
        // -> High frequency
        on(
            "userStartedBeingStill",
            run("emitHighFrequencyGeolocationAcquisitionCanStopEvent")
        );
        on(
            "stopEvent",
            run("emitHighFrequencyGeolocationAcquisitionCanStopEvent")
        );
        on(
            "userFinishedBeingStill",
            run("acquirePhoneGeolocation")
                .every(1, "minutes")
                .cancelOn("highFrequencyGeolocationAcquisitionCanStop")
        );
        // -> All frequencies & modes
        on("geolocationAcquired", run("writeRecords"));
        // END: Low resolution data collection

        // START: Geofence detection
        on(
            "geolocationAcquired",
            run("checkAreaOfInterestProximity", {
                nearbyRange: 100,
                offset: 15,
            })
        );
        on("movedCloseToAreaOfInterest", run("writeRecords"));
        on("movedInsideAreaOfInterest", run("writeRecords"));
        on("movedOutsideAreaOfInterest", run("writeRecords"));
        on("movedAwayFromAreaOfInterest", run("writeRecords"));
        // END: Geofence detection

        // START: High resolution geolocation data collection
        on(
            "movedCloseToAreaOfInterest",
            run("emitHighFrequencyMultipleGeolocationAcquisitionCanStartEvent")
        );
        on(
            "movedInsideAreaOfInterest",
            run("emitHighFrequencyMultipleGeolocationAcquisitionCanStartEvent")
        );
        on(
            "movedAwayFromAreaOfInterest",
            run("emitHighFrequencyMultipleGeolocationAcquisitionCanStopEvent")
        );
        on(
            "stopEvent",
            run("emitHighFrequencyMultipleGeolocationAcquisitionCanStopEvent")
        );
        on(
            "exposureFinished",
            run("emitHighFrequencyMultipleGeolocationAcquisitionCanStopEvent")
        );
        // TODO: Temporal fix, remove
        on(
            // nearbyAoIGeolocationAcquisitionCanStart
            "highFrequencyMultipleGeolocationAcquisitionCanStart",
            run("acquirePhoneGeolocation", {
                id: "nearby-aoi-constant-geolocation",
            })
                .every(1, "minutes")
                // nearbyAoIGeolocationAcquisitionCanStop
                .cancelOn("highFrequencyMultipleGeolocationAcquisitionCanStop")
        );
        // FIXME: Make this work with notification taps
        /*on(
            "highFrequencyMultipleGeolocationAcquisitionCanStart",
            run("acquireMultiplePhoneGeolocation", { maxInterval: 10000 })
                .every(1, "minutes")
                .cancelOn("highFrequencyMultipleGeolocationAcquisitionCanStop")
        );*/
        // END: High resolution geolocation data collection

        // START: Pre-exposure events
        // -> Stays nearby an area of interest for a while
        on(
            "movedInsideAreaOfInterest",
            run("emitMovedOutsideAreaOfInterestOuterRadiusEvent")
        );
        on(
            "movedAwayFromAreaOfInterest",
            run("emitMovedOutsideAreaOfInterestOuterRadiusEvent")
        );
        on(
            "movedCloseToAreaOfInterest",
            run("sendNotification", {
                title: "Has llegado a un lugar importante",
                body: "Exponerte te ayudará a superar tu problema, adelante",
            })
                .in(10, "minutes")
                .cancelOn("movedOutsideAreaOfInterestOuterRadius")
        );
        // -> Enters a exposure area
        on("movedInsideAreaOfInterest", run("checkExposureAreaStatus"));
        on(
            "enteredAreaWithNoOngoingExposure",
            run("sendNotification", {
                title: "Estás en un lugar importante",
                body: "Toca la notificación para iniciar una exposición",
                tapAction: {
                    type: "ask-confirmation",
                    id: "start-exposure",
                },
            })
        );
        // -> Confirms to start a exposure
        on("exposureStartConfirmed", run("startExposure"));
        on(
            "exposureStarted",
            run("sendNotification", {
                title: "Acabas de iniciar una exposición",
                body: "Pulsa aquí si tienes dudas",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "c04",
                },
            })
        );
        on("exposureStarted", run("writeRecords"));
        // END: Pre-exposure events

        // START: Exposure events
        // -> Possible exposure finalization causes
        on("exposureFinished", run("emitExposureForcedToFinishEvent"));
        on("stopEvent", run("emitExposureForcedToFinishEvent"));
        // -> Deliver questions every 5 minutes as long as the exposure lasts
        on(
            "exposureStarted",
            run("sendNotification", {
                title: "¿Podrías decirnos cómo te encuentras?",
                body: "Toca la notificación para responder",
                tapAction: {
                    type: TapActionType.DELIVER_QUESTIONS,
                    id: "anxiety-questions",
                },
            })
                .every(5, "minutes")
                .cancelOn("exposureForcedToFinish")
        );
        on("questionnaireAnswersAcquired", run("writeRecords"));
        on("questionnaireAnswersAcquired", run("processExposureAnswers"));
        // -> Leaving exposure area
        on("movedOutsideAreaOfInterest", run("checkExposureAreaLeft"));
        on(
            "exposureAreaLeft",
            run("sendNotification", {
                title: "Parece que has salido del lugar de exposición",
                body: "Recuerda que debes quedarte cerca del área",
            })
        );
        on("exposureAreaLeft", run("writeRecords"));
        // -> Returning exposure area
        on("enteredAreaWithOngoingExposure", run("checkExposureAreaReturn"));
        on(
            "returnedToExposureArea",
            run("sendNotification", {
                title: "Vemos que has vuelto al lugar de exposición",
                body: "Nos alegra que hayas vuelto. Puedes hacerlo",
            })
        );
        on("returnedToExposureArea", run("writeRecords"));
        // -> Abandoning exposure area
        on("movedAwayFromAreaOfInterest", run("checkExposureDropout"));
        on("exposureDroppedOut", run("finishExposure", { successful: false }));
        on(
            "exposureDroppedOut",
            run("sendNotification", {
                title: "Has abandonado el lugar de exposición",
                body: "Por favor, pulsa aquí para indicar el motivo",
                tapAction: {
                    type: TapActionType.ASK_FEEDBACK,
                    id: "exposure-left",
                },
            })
        );
        // -> Manually finishing exposure
        on(
            "exposureManuallyFinished",
            run("finishExposure", { successful: false })
        );
        // -> Standard time limit reached
        on(
            "exposureStarted",
            run("evaluateExposure", {
                emotionThreshold: 5,
                peakToLastThreshold: 3,
            })
                .in(EXPOSURE_TIME, "minutes")
                .cancelOn("exposureForcedToFinish")
        );
        // -> Exposure evaluation results successful
        on(
            "exposureEvaluationResultedSuccessful",
            run("sendNotification", {
                title: "Bien, has manejado la situación",
                body: "Puedes terminar aquí o continuar un poco más",
            })
        );
        on(
            "exposureEvaluationResultedSuccessful",
            run("finishExposure", { successful: true })
        );
        // -> Exposure evaluation results neutral
        on(
            "exposureEvaluationResultedNeutral",
            run("sendNotification", {
                title: "Has conseguido reducir tu ansiedad, es un gran logro",
                body: "Pulsa aquí, leer esto puede resultarte útil",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "c05",
                },
            })
        );
        on(
            "exposureEvaluationResultedNeutral",
            run("finishExposure", { successful: true })
        );
        // -> Exposure evaluation results unsuccessful
        on(
            "exposureEvaluationResultedUnsuccessful",
            run("sendNotification", {
                title: "Puedes prolongar tu tiempo de exposición",
                body: "Pulsa aquí, leer esto puede resultarte de ayuda",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "c07",
                },
            })
        );
        on(
            "exposureEvaluationResultedUnsuccessful",
            run("evaluateExposureExtension", {
                emotionThreshold: 8,
            })
                .in(EXPOSURE_EXTENSION_TIME, "minutes")
                .cancelOn("exposureForcedToFinish")
        );
        // -> Exposure extension evaluation results successful
        on(
            "exposureExtensionEvaluationResultedSuccessful",
            run("sendNotification", {
                title: "Te has esforzado mucho, con la práctica mejorarás",
                body: "Pulsa aquí, leer esto puede resultarte útil",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "c08",
                },
            })
        );
        on(
            "exposureExtensionEvaluationResultedSuccessful",
            run("finishExposure", { successful: true })
        );
        // -> Exposure extension evaluation results unsuccessful
        on(
            "exposureExtensionEvaluationResultedUnsuccessful",
            run("sendNotification", {
                title: "Puedes hablar con tu terapeuta pulsando aquí",
            })
        );
        on(
            "exposureExtensionEvaluationResultedUnsuccessful",
            run("finishExposure", { successful: true })
                .in(EXPOSURE_EXTENSION_TIME, "minutes")
                .cancelOn("exposureForcedToFinish")
        );
        on(
            "exposureExtensionEvaluationResultedUnsuccessful",
            run("sendNotification", {
                title: "Sabemos que no es fácil, pero te has esforzado mucho",
                body: "Podemos finalizar la exposición por hoy",
            })
                .in(EXPOSURE_EXTENSION_TIME, "minutes")
                .cancelOn("exposureForcedToFinish")
        );
        // -> Finalization event
        on("exposureFinished", run("writeRecords"));
        // END: Exposure events

        // START: Post-exposure events
        on("exposureFinished", run("checkIfExposureWasDroppedOut"));
        on("exposureWasNotDroppedOut", run("calculateExposureAggregate"));
        on("exposureAggregateCalculated", run("writeRecords"));
        on("exposureWasNotDroppedOut", run("calculateExposurePlaceAggregate"));
        on("exposurePlaceAggregateCalculated", run("writeRecords"));
        on(
            "exposureWasNotDroppedOut",
            run("limitedFeedbackDelivery", {
                feedbackId: "question-frequency",
                maxCount: 3,
            })
        );
        on(
            "canDeliverFeedback",
            run("sendNotification", {
                title: "¿Te animas a valorar la experiencia?",
                tapAction: {
                    type: TapActionType.ASK_FEEDBACK,
                    id: "question-frequency",
                },
            })
                .in(5, "minutes")
                .cancelOn("stopEvent")
        );
        // END: Post-exposure events

        // START: Patient feedback events
        on("patientFeedbackAcquired", run("writeRecords"));
        on("patientFeedbackAcquired", run("trackFeedbackAcquisition"));
        // END: Patient feedback events

        // START: App usage events
        // -> Notification tap
        on("notificationTapped", run("writeRecords"));
        // -> Notification discard
        on("notificationCleared", run("writeRecords"));
        // END: App usage events
    }
}

export const demoTaskGraph = new DemoTaskGraph();
