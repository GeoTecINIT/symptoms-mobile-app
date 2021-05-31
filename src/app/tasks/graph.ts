import {
    TaskGraph,
    EventListenerGenerator,
    RunnableTaskDescriptor,
} from "@geotecinit/emai-framework/tasks/graph";

import { TapActionType } from "@geotecinit/emai-framework/notifications";

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
            "highFrequencyMultipleGeolocationAcquisitionCanStart",
            run("acquireMultiplePhoneGeolocation", { maxInterval: 10000 })
                .every(1, "minutes")
                .cancelOn("highFrequencyMultipleGeolocationAcquisitionCanStop")
        );
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
                .cancelOn("exposureFinished")
        );
        on("questionnaireAnswersAcquired", run("writeRecords"));
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
        // -> Finalization event
        on("exposureFinished", run("writeRecords"));
        // END: Exposure events

        // START: Patient feedback events
        on("patientFeedbackAcquired", run("writeRecords"));
        // END: Patient feedback events

        // START: App usage events
        // -> Notification tap
        on("notificationTapped", run("writeRecords"));
        // -> Notification discard
        on("notificationCleared", run("writeRecords"));
        // END: App usage events

        on(
            "exposureSuccessfullyFinished",
            run("sendNotification", {
                title: "Bien, has manejado la situación",
                body: "Puedes terminar aquí o continuar un poco más",
            })
        );
        on(
            "exposureNeutrallyFinished",
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
            "exposureBadlyFinished",
            run("sendNotification", {
                title: "Puedes prologar tu tiempo de exposición",
                body: "Pulsa aquí, leer esto puede resultarte de ayuda",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "c03",
                },
            })
        );
        on(
            "exposureTimeExtensionFinishedFine",
            run("sendNotification", {
                title: "Te has esforzado mucho, con la práctica mejorarás",
                body: "Pulsa aquí, leer esto puede resultarte útil",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "c02",
                },
            })
        );
        on(
            "exposureTimeExtensionFinishedBadly",
            run("sendNotification", {
                title: "Puedes hablar con tu terapeuta pulsando aquí",
            })
        );

        on(
            "shouldDeliverQuestionFrequencyFeedback",
            run("sendNotification", {
                title: "¿Te animas a valorar la experiencia?",
                tapAction: {
                    type: TapActionType.ASK_FEEDBACK,
                    id: "question-frequency",
                },
            })
        );
    }
}

export const demoTaskGraph = new DemoTaskGraph();
