import { getConfig } from "~/app/core/config";

import {
    EventListenerGenerator,
    RunnableTaskDescriptor,
    TaskGraph,
} from "@awarns/core/tasks/graph";
import { TapActionType } from "@awarns/notifications";
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

        on("sendWatchConnectedMessage", run("sendPlainMessageToWatch"));
        on("sendWatchNotConnectedMessage", run("sendPlainMessageToWatch"));

        // START: Acquire phone geolocation when app starts
        on("startEvent", run("acquirePhoneGeolocation").in(1, "minutes"));
        // END: Acquire phone geolocation when app starts

        // START: Low resolution geolocation data collection
        // -> Low frequency
        // Low frequency Geolocation is active by default in case of Human Activity plugin does not work
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
                .every(3, "minutes") // Using 3 minutes instead of 15 so that the patient does not have to wait as long for notifications
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
                .every(1, "minutes") // Do not use less than 1 min for acquiring phone geolocation
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
                    type: TapActionType.ASK_CONFIRMATION,
                    id: "exposure-intention",
                },
            })
        );
        // -> Confirms intends to carry on an exposure
        on("preExposureStartConfirmed", run("preStartExposure"));
        // Reinforcement message notification when preExposureStartConfirmed
        on(
            "preExposureStartConfirmed",
            run("sendRandomNotification", {
                options: [
                    {
                        title: "Empezar una exposición es un gran paso",
                        body: "Entra en el área para empezar la exposición",
                    },
                    {
                        title: "¡Muy bien! Estás cerca de empezar una exposición",
                        body: "Entra en el área para empezar la exposición",
                    },
                    {
                        title: "¡Fantástico! Estás dispuesto a exponerte",
                        body: "Entra en el área para empezar la exposición",
                    },
                    {
                        title: "Exponerte te acercará a tu recuperación.",
                        body: "Entra en el área para empezar la exposición",
                    },
                    {
                        title: "Exponerte te acercará a lograr tus objetivos.",
                        body: "Entra en el área para empezar la exposición",
                    },
                    {
                        title: "¡Has tomado la mejor decisión para empezar a superar tu problema! Adelante, ¡tú puedes hacerlo!",
                        body: "Entra en el área para empezar la exposición",
                    },
                ],
            })
        );
        // -> Send a notification to ask initial questions if the patient confirms their intention to proceed with the exposure
        on(
            "preExposureStartConfirmed",
            run("emitSendNotificationForInitialQuestionsEvent")
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
                    type: TapActionType.ASK_CONFIRMATION,
                    id: "start-exposure",
                },
            })
        );
        // -> Confirms to start an exposure
        on("exposureStartConfirmed", run("startExposure"));
        on(
            "exposureStartConfirmed",
            run("emitSendNotificationForInitialQuestionsEvent")
        );

        // -> Send info notification only if there are no exposures
        on(
            "exposureStartConfirmed",
            run("sendNotificationNthExposure", {
                numberOfExposure: 0,
                title: "Acabas de iniciar una exposición",
                body: "Pulsa aquí si tienes dudas sobre como proceder",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "cp03",
                },
            })
        );

        // Ask patient for USAS and feedback after starting an exposure
        on(
            "sendNotificationForInitialQuestions",
            run("sendNotification", {
                title: "¿Podrías decirnos cómo te encuentras?",
                body: "Toca la notificación para responder",
                tapAction: {
                    type: TapActionType.DELIVER_QUESTIONS,
                    id: "pre-exposure-questions",
                },
            })
        );

        on("exposureStarted", run("writeRecords"));
        // -> Detect heart rate with watch
        on("exposureStarted", run("startDetectingWatchHeartRateChanges"));

        // necessary in order to change smartwatch interface
        on(
            "exposureStarted",
            run("sendPlainMessageToWatch", {
                plainMessage: {
                    message: "Exposure started",
                },
            })
        );
        on("plainMessageSent", run("writeRecords"));
        // on("sendExposureProgress", run("sendPlainMessageToWatch"));
        // on("plainMessageSent", run("writeRecords"));

        on("watchHeartRateSamplesAcquired", run("writeRecords"));
        // END: Pre-exposure events

        // START: Exposure events
        // -> Possible exposure finalization causes
        on("exposureFinished", run("emitExposureForcedToFinishEvent"));
        on("stopEvent", run("emitExposureForcedToFinishEvent"));
        // -> Deliver questions every 10 minutes as long as the exposure lasts
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
        // Need to execute encodeAudios task as could be audios in the questionnaire answers
        on("questionnaireAnswersAcquired", run("encodeAudio"));
        on("audiosEncodedInQuestionnaire", run("writeRecords"));
        on(
            "audiosEncodedInQuestionnaireWithoutProcessing",
            run("writeRecords")
        );
        on("audiosEncodedInQuestionnaire", run("processExposureAnswers"));
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
                // body: "Contacta con tu psicólogo para comentar tus avances",
                body: "Sigue como hasta ahora para progresar con tus avances",
            })
        );
        // Send notification for reinforcement due to not positive evolving
        on(
            "patientNotShowsAnxietyPositiveEvolution",
            run("sendCustomNotification", {
                title: "A veces puede ser complicado que la ansiedad baje",
                body: "En ocasiones la ansiedad se mantiene alta durante más tiempo. Esto es totalmente normal y forma parte del proceso de cambio",
            })
        );
        // Send notification for reinforcement due to positive evolving
        on(
            "patientShowsAnxietyPositiveEvolution",
            run("sendCustomNotification", {
                title: "Estás haciendo grandes progresos",
                body: "Sigue así 😊",
            })
        );
        // -> Determines that the patient could get some reward (or booster)
        on(
            "patientCouldGetSomeReward",
            run("sendRandomNotification", {
                options: [
                    { title: "¡Lo estás haciendo genial! 💪" },
                    { title: "Estás tolerando el malestar 🙂" },
                    { title: "Parece que tu ansiedad es controlada 👍" },
                    { title: "Tu resiliencia es admirable 💖" },
                    { title: "Estás tomando el control, ¡bien hecho! 🛡️" },
                ],
            })
        );
        on(
            "patientCouldGetABooster",
            run("sendRandomNotification", {
                options: [
                    { title: "¡Vamos! Sigue con la exposición 🙂" },
                    { title: "¡Tu puedes! No te rindas 🙂" },
                    { title: "¡Lo estás logrando! No pares ahora 🌟" },
                    { title: "¡Sigue así! Cada paso cuenta 👣" },
                    { title: "¡Tú puedes! La perseverancia es clave 💫" },
                ],
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
                    type: TapActionType.ASK_CONFIRMATION,
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
                    id: "cp07",
                },
            })
        );
        on("exposureAreaLeft", run("writeRecords"));
        // -> Returning exposure area
        on("enteredAreaWithOngoingExposure", run("checkExposureAreaReturn"));
        on(
            "returnedToExposureArea",
            run("sendNotification", {
                title: "¡Felicidades por regresar!",
                body: "Los escapes pueden ayudarte en momentos difíciles y de intenso malestar, pero regresar es algo fundamental y muy necesario para conseguir los objetivos terapéuticos. Ahora, ¡adelante!",
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
                peakToLastThreshold: 2,
            })
                .in(EXPOSURE_MINUTES, "minutes")
                .cancelOn("exposureForcedToFinish")
        );
        // -> Exposure evaluation results successful
        on(
            "exposureEvaluationResultedSuccessful",
            run("sendNotification", {
                title: "¡Has tolerado muy bien la ansiedad!",
                body: "Puedes terminar aquí o ir a otro lugar",
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
                    id: "cg08",
                },
            })
        );
        on(
            "exposureExtensionEvaluationResultedUnsuccessful",
            run("finishExposure", { successful: true }) // Although the evaluation result was unsuccessful, the variable "successful" is true as the patient completed the exposure without dropping out.
        );
        // -> Finalization event
        on("exposureFinished", run("stopDetectingWatchHeartRateChanges"));
        on(
            "exposureFinished",
            run("sendPlainMessageToWatch", {
                plainMessage: {
                    message: "Exposure finished",
                },
            })
        );
        on("plainMessageSent", run("writeRecords"));
        on("exposureFinished", run("writeRecords"));
        // END: Exposure events

        // START: Post-exposure events
        on("exposureFinished", run("clearNotifications"));

        on(
            "exposureFinished",
            run("sendNotificationNthExposure", {
                numberOfExposure: 1, // Exposure was just finished and there will be 1 exposure in the local DB
                title: "¡Has terminado tu primera exposición!",
                body: "Pulsa aquí para saber más sobre los efectos de las exposiciones",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "cp04",
                },
            })
        );

        on(
            "exposureFinished",
            run("sendNotificationNthExposure", {
                numberOfExposure: 2, // Exposure was just finished and there will be 2 exposures in the local DB
                title: "Aprende a controlar tus miedos",
                body: "Pulsa aquí para aprender herramientas para gestionar tus emociones",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "cp08",
                },
            })
        );

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
        // Need to execute encodeAudios task as could be audios in the patient feedback
        on("patientFeedbackAcquired", run("encodeAudio"));
        on("audiosEncodedInFeedback", run("writeRecords"));
        on("patientFeedbackAcquired", run("trackFeedbackAcquisition"));
        // END: Patient feedback events

        // START: Patient confirmation events
        on("patientConfirmationAcquired", run("writeRecords"));
        // END: Patient confirmation events

        // START: Patient read content events
        on("patientReadContentAcquired", run("writeRecords"));
        // END: Patient read content read events

        // START: App usage events
        // -> Notification tap
        on("notificationTapped", run("writeRecords"));
        // -> Notification discard
        on("notificationCleared", run("writeRecords"));
        // END: App usage events
    }
}

export const appTaskGraph = new DemoTaskGraph();
