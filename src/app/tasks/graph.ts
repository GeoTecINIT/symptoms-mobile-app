import { getConfig } from "~/app/core/config";

import {
    EventListenerGenerator,
    RunnableTaskDescriptor,
    TaskGraph,
} from "@geotecinit/emai-framework/tasks/graph";
import { TapActionType } from "@geotecinit/emai-framework/notifications";
import { AdvancedSetting, advancedSettings } from "~/app/core/account";

const exposureTimes = getConfig().exposureTimes;
const EXPOSURE_MINUTES = exposureTimes.regular;
const EXPOSURE_EXTENSION_MINUTES = exposureTimes.extension;
const BETWEEN_QUESTIONS_MINUTES = exposureTimes.betweenQuestions;

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
                nearbyRange: advancedSettings.getNumber(
                    AdvancedSetting.NearbyExposureRadius
                ),
                offset: advancedSettings.getNumber(
                    AdvancedSetting.ExposureRadiusOffset
                ),
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
        // -> Watch exposure area outer radius proximity changes
        on(
            "movedInsideAreaOfInterest",
            run("emitMovedOutsideAreaOfInterestOuterRadiusEvent")
        );
        on(
            "movedAwayFromAreaOfInterest",
            run("emitMovedOutsideAreaOfInterestOuterRadiusEvent")
        );
        on("movedCloseToAreaOfInterest", run("checkPreExposureStatus"));
        // -> Gets nearby an area of interest
        on(
            "approachedAreaWithNoOngoingExposure",
            run("sendNotification", {
                title: "Estás cerca de un lugar de exposición",
                body: "¿Vas a hacer una?",
                tapAction: {
                    type: "ask-confirmation",
                    id: "exposure-intention",
                },
            })
        );
        // -> Confirms intends to carry on an exposure
        on("preExposureStartConfirmed", run("preStartExposure"));
        on(
            "preExposureStartConfirmed",
            run("sendNotification", {
                title: "¿Podrías decirnos cómo te encuentras?",
                body: "Toca la notificación para responder",
                tapAction: {
                    type: TapActionType.DELIVER_QUESTIONS,
                    id: "pre-exposure-questions",
                },
            })
        );
        // -> Watch in case leaves the vicinity of the area without getting closer
        on("movedAwayFromAreaOfInterest", run("cancelPreExposure"));
        on(
            "preExposureCancelled",
            run("sendNotification", {
                title: "¿Dificultades para realizar la exposición?",
                body: "Por favor, pulsa aquí para indicar el motivo",
                tapAction: {
                    type: TapActionType.ASK_FEEDBACK,
                    id: "exposure-discarded",
                },
            })
        );
        // -> Stays nearby an area of interest for a while
        on(
            "movedCloseToAreaOfInterest",
            run("sendNotification", {
                title: "Has llegado a un lugar de exposición",
                body: "Exponerte te ayudará a superar tu problema, adelante",
            })
                .in(10, "minutes")
                .cancelOn("movedOutsideAreaOfInterestOuterRadius")
        );
        // -> Enters an exposure area
        on("movedInsideAreaOfInterest", run("checkExposureAreaStatus"));
        // -> Enters exposure area with a pre-started exposure
        on("enteredAreaWithPreStartedExposure", run("startExposure"));
        // -> Enters exposure area with no ongoing exposure
        on(
            "enteredAreaWithNoOngoingExposure",
            run("sendNotification", {
                title: "Has llegado a un lugar de exposición",
                body: "¿Te animas a hacer una?",
                tapAction: {
                    type: "ask-confirmation",
                    id: "start-exposure",
                },
            })
        );
        // -> Confirms to start an exposure
        on("exposureStartConfirmed", run("startExposure"));
        on(
            "exposureStarted",
            run("sendNotification", {
                title: "Acabas de iniciar una exposición",
                body: "Pulsa aquí si tienes dudas sobre como proceder",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "cg01",
                },
            })
        );
        on("exposureStarted", run("writeRecords"));
        // END: Pre-exposure events

        // START: Exposure events
        // -> Possible exposure finalization causes
        on("exposureFinished", run("emitExposureForcedToFinishEvent"));
        on("stopEvent", run("emitExposureForcedToFinishEvent"));
        // -> Deliver questions every 8 minutes as long as the exposure lasts
        on(
            "exposureStarted",
            run("sendNotification", {
                title: "¿Podrías decirnos cómo te encuentras?",
                body: "Toca la notificación para responder",
                tapAction: {
                    type: TapActionType.DELIVER_QUESTIONS,
                    id: "exposure-questions",
                },
            })
                .every(BETWEEN_QUESTIONS_MINUTES, "minutes")
                .cancelOn("exposureForcedToFinish")
        );
        on("questionnaireAnswersAcquired", run("writeRecords"));
        on("questionnaireAnswersAcquired", run("processExposureAnswers"));
        // -> Evaluate exposure answers at runtime
        on("exposureAnswersProcessed", run("evaluateExposureAnswers"));
        // -> Determines that the exposure is not needed due to low sustained anxiety level
        on(
            "patientShowsAnInitialSustainedLowAnxietyLevel",
            run("finishExposure", { successful: true })
        );
        on(
            "patientShowsAnInitialSustainedLowAnxietyLevel",
            run("sendNotification", {
                title: "Enhorabuena, toleras bien esta situación",
                body: "Puedes terminar aquí o continuar un poco más",
            })
        );
        // -> Determines that the patient requires some reinforcement due to high anxiety values
        on(
            "patientShowsAHighAnxietyLevel",
            run("sendNotification", {
                title: "Tu ansiedad actual parece muy intensa",
                body: "Pulsa aquí, quizás esto te ayude",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "cg02",
                },
            })
        );
        // -> Determines that the patient could get some reward (or booster)
        on(
            "patientCouldGetSomeReward",
            run("sendRandomNotification", {
                options: [
                    { title: "Lo estás haciendo muy bien" },
                    { title: "Estás tolerando muy bien el malestar" },
                ],
            })
        );
        on(
            "patientCouldGetABooster",
            run("sendNotification", {
                title: "Lo estás haciendo muy bien",
            })
        );
        // -> Leaving exposure area
        on("movedOutsideAreaOfInterest", run("checkExposureAreaLeft"));
        on(
            "exposureAreaLeft",
            run("sendNotification", {
                title: "Parece que has salido del lugar de exposición",
                body: "Pulsa sobre la notificación, por favor",
                tapAction: {
                    type: "ask-confirmation",
                    id: "escape-intention",
                },
            })
        );
        on(
            "patientDidNotLeaveExposureAreaOnPurpose",
            run("sendNotification", {
                title: "Puedes continuar como hasta ahora",
                body: "Intenta permanecer cerca del área",
            })
        );
        on(
            "patientLeftExposureAreaOnPurpose",
            run("sendNotification", {
                title: "Abandonar ahora retrasaría tu recuperación",
                body: "Pulsa aquí para recordar el papel de la evitación",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "cg03",
                },
            })
        );
        on("exposureAreaLeft", run("writeRecords"));
        // -> Returning exposure area
        on("enteredAreaWithOngoingExposure", run("checkExposureAreaReturn"));
        on(
            "returnedToExposureArea",
            run("sendNotification", {
                title: "Vemos que has vuelto al lugar de exposición",
                body: "Nos alegra que hayas vuelto, adelante",
            })
        );
        on("returnedToExposureArea", run("writeRecords"));
        // -> Abandoning exposure area
        on("movedAwayFromAreaOfInterest", run("checkExposureDropout"));
        on("exposureDroppedOut", run("finishExposure", { successful: false }));
        on(
            "exposureDroppedOut",
            run("sendNotification", {
                title: "Sentimos que hayas dejado la exposición",
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
                .in(EXPOSURE_MINUTES, "minutes")
                .cancelOn("exposureForcedToFinish")
        );
        // -> Exposure evaluation results successful
        on(
            "exposureEvaluationResultedSuccessful",
            run("sendNotification", {
                title: "¡Has tolerado muy bien la ansiedad!",
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
                title: "Has conseguido tolerar tu ansiedad, es un gran logro",
                body: "Pulsa aquí, leer esto puede resultarte útil",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "cg04",
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
                title: "Te recomendamos permanecer un poco más",
                body: "Pulsa aquí, leer esto te puede resultar de ayuda",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "cg05",
                },
            })
        );
        on(
            "exposureEvaluationResultedUnsuccessful",
            run("evaluateExposureExtension", {
                emotionThreshold: 8,
            })
                .in(EXPOSURE_EXTENSION_MINUTES, "minutes")
                .cancelOn("exposureForcedToFinish")
        );
        // -> Exposure extension evaluation results successful
        on(
            "exposureExtensionEvaluationResultedSuccessful",
            run("sendNotification", {
                title: "Bien hecho, será más tolerable con la práctica",
                body: "Pulsa aquí, leer esto puede resultarte útil",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "cg06",
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
                title: "A veces resulta difícil tolerar la ansiedad",
                body: "Pulsa aquí, quizás estas pautas te ayuden",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "cg07",
                },
            })
        );
        on(
            "exposureExtensionEvaluationResultedUnsuccessful",
            run("finishExposure", { successful: true })
                .in(EXPOSURE_EXTENSION_MINUTES, "minutes")
                .cancelOn("exposureForcedToFinish")
        );
        on(
            "exposureExtensionEvaluationResultedUnsuccessful",
            run("sendNotification", {
                title: "Sabemos que no es fácil. Te has esforzado mucho",
                body: "Podemos finalizar la exposición por hoy. Pulsa aquí",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "cg08",
                },
            })
                .in(EXPOSURE_EXTENSION_MINUTES, "minutes")
                .cancelOn("exposureForcedToFinish")
        );
        // -> Finalization event
        on("exposureFinished", run("writeRecords"));
        // END: Exposure events

        // START: Post-exposure events
        on("exposureFinished", run("checkIfExposureWasDroppedOut"));
        on(
            "exposureWasNotDroppedOut",
            run("sendNotification", {
                title: "Has realizado un gran trabajo, enhorabuena",
                body: "¿Podrías responder a estas preguntas?",
                tapAction: {
                    type: TapActionType.DELIVER_QUESTIONS,
                    id: "post-exposure-questions",
                },
            })
                .in(1, "minutes")
                .cancelOn("stopEvent")
        );
        on("exposureWasNotDroppedOut", run("calculateExposureAggregate"));
        on("exposureAggregateCalculated", run("writeRecords"));
        on("exposureWasNotDroppedOut", run("calculateExposurePlaceAggregate"));
        on("exposurePlaceAggregateCalculated", run("writeRecords"));
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
