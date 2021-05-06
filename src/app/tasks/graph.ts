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
                body: "La exposición es fundamental. Adelante, ¡ánimo!",
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
                body: "Quédate cerca para que la terapia sea más efectiva",
            })
        );
        on(
            "reenteredAreaOfInterest",
            run("sendNotification", {
                title: "¡Genial! Has vuelto al lugar de exposición",
                body: "Nos alegra mucho que hayas vuelto. ¡Tú puedes! 💪",
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
                title: "¡Bien hecho! Has dominado la situación",
                body: "Puedes irte y revisar tu progreso si lo deseas",
            })
        );
        on(
            "exposureNeutrallyFinished",
            run("sendNotification", {
                title: "Te has esforzado mucho, ¡sigue así!",
                body: "Puedes reforzar el esfuerzo pulsando aquí",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "c05",
                },
            })
        );
        on(
            "exposureBadlyFinished",
            run("sendNotification", {
                title: "Deberías quedarte un poco más. Respira hondo ☺",
                body: "Pulsa aquí, quizás esto te ayude",
                tapAction: {
                    type: TapActionType.OPEN_CONTENT,
                    id: "c03",
                },
            })
        );
        on(
            "exposureTimeExtensionFinished",
            run("sendNotification", {
                title: "¿Te encuentras bien?",
                body: "Puedes hablar con tu terapeuta pulsando aquí",
            })
        );

        on(
            "shouldDeliverQuestionFrequencyFeedback",
            run("sendNotification", {
                title: "¿Cómo ha ido?",
                body: "¿Te animas a valorar la experiencia?",
                tapAction: {
                    type: TapActionType.ASK_FEEDBACK,
                    id: "question-frequency",
                },
            })
        );
    }
}

export const demoTaskGraph = new DemoTaskGraph();
