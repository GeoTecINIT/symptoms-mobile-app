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
        on(
            "startEvent",
            run("acquirePhoneGeolocation")
                .every(5, "minutes")
                .cancelOn("stopEvent")
        );

        on(
            "stayedForAWhileCloseToAreaOfInterest",
            run("sendNotification", {
                title: "Has llegado a un lugar importante",
                body: "Exponerte te ayudará a superar tu problema, adelante",
            })
        );
        on(
            "movedInsideAreaOfInterest",
            run("sendNotification", {
                title: "Estás en un lugar importante",
                body: "Toca la notificación para iniciar una exposición",
                tapAction: {
                    type: "ask-confirmation",
                    id: "start-exposure",
                },
            })
        );

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

        on(
            "wantsToAnswerQuestions",
            run("sendNotification", {
                title: "¿Podrías decirnos cómo te encuentras?",
                body: "Toca la notificación para responder",
                tapAction: {
                    type: TapActionType.DELIVER_QUESTIONS,
                    id: "anxiety-questions",
                },
            })
        );
        on(
            "movedOutsideAreaOfInterest",
            run("sendNotification", {
                title: "Parece que has salido del lugar de exposición",
                body: "Recuerda que debes quedarte cerca del área",
            })
        );
        on(
            "reenteredAreaOfInterest",
            run("sendNotification", {
                title: "Vemos que has vuelto al lugar de exposición",
                body: "Nos alegra que hayas vuelto. Puedes hacerlo",
            })
        );
        on(
            "movedAwayFromAreaOfInterest",
            run("sendNotification", {
                title: "Has abandonado el lugar de exposición",
                body: "Por favor, pulsa aquí para indicar el motivo",
                tapAction: {
                    type: TapActionType.ASK_FEEDBACK,
                    id: "exposure-left",
                },
            })
        );

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
                    id: "c07",
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
                    id: "c08",
                },
            })
        );
        on(
            "exposureTimeExtensionFinishedBadly",
            run("sendNotification", {
                title: "Puedes hablar con tu terapeuta pulsando aquí",
                body: " ",
            })
        );
        on(
            "exposureRunOutOfTime",
            run("sendNotification", {
                title: "Sabemos que no es fácil, pero te has esforzado mucho",
                body: "Podemos finalizar la exposición por hoy",
            })
        );

        on(
            "shouldDeliverQuestionFrequencyFeedback",
            run("sendNotification", {
                title: "¿Te animas a valorar la experiencia?",
                body: " ",
                tapAction: {
                    type: TapActionType.ASK_FEEDBACK,
                    id: "question-frequency",
                },
            })
        );
    }
}

export const demoTaskGraph = new DemoTaskGraph();
