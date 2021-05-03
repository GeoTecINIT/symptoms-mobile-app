import { Component, OnInit } from "@angular/core";
import { ConfirmModalService } from "../../modals/confirm";
import { QuestionsModalService } from "../../modals/questions/questions-modal.service";
import { FeedbackModalService } from "../../modals/feedback";

@Component({
    selector: "SymSimulationActions",
    templateUrl: "./simulation-actions.component.html",
    styleUrls: ["./simulation-actions.component.scss"],
})
export class SimulationActionsComponent implements OnInit {
    constructor(
        private confirmModalService: ConfirmModalService,
        private questionsModalService: QuestionsModalService,
        private feedbackModalService: FeedbackModalService
    ) {
        // Initialize dependencies here
    }

    ngOnInit() {
        // Use initialized dependencies
    }

    onRelevantPlaceArrival() {
        this.confirmModalService
            .show({
                title: "Estás en un lugar importante",
                body: {
                    iconCode: "\ue55f",
                    text: "Has llegado a: Lugar 1",
                },
                question: "¿Te animas a hacer una exposición ahora?",
                buttons: {
                    confirm: "¡Claro!",
                    cancel: "En otro momento",
                },
            })
            .then((result) => console.log("Result:", result))
            .catch((e) => console.error("Could not show confirm modal:", e));
    }

    onWantsToAnswerQuestions() {
        this.questionsModalService.deliverQuestions();
    }

    onWantsToLeave() {
        this.feedbackModalService
            .askFeedback({
                title: "En otro momento entonces",
                feedbackScreen: {
                    body: {
                        emoji: "👋",
                        text:
                            "No te preocupes, lo importante es ser constante. ¡Hasta pronto!",
                    },
                    question: "¿Podrías indicar el motivo de tu salida?",
                    options: [
                        {
                            type: "predefined",
                            answer: "Mi nivel de ansiedad no baja",
                        },
                        {
                            type: "predefined",
                            answer: "No consigo manejar la situación",
                        },
                        {
                            type: "predefined",
                            answer: "No dispongo de más tiempo",
                        },
                        {
                            type: "free-text",
                            hint: "Otro",
                            helpText: "Tu terapeuta podrá leer este mensaje",
                        },
                    ],
                },
            })
            .then((result) => console.log("Feedback:", result));
    }

    onWantsToDeliverFeedback() {
        this.feedbackModalService
            .askFeedback({
                title: "¿Qué tal lo estamos haciendo?",
                feedbackScreen: {
                    body: {
                        iconCode: "\ue913",
                        text:
                            "Por favor, ayúdanos a mejorar respondiendo a unas cuestiones sobre la experiencia de uso de la aplicación",
                    },
                    question:
                        "¿Cómo valorarías la frecuencia con la que recibes preguntas?",
                    options: [
                        {
                            type: "predefined",
                            answer: "Alta, recibo muchas preguntas",
                        },
                        {
                            type: "predefined",
                            answer: "Adecuada, no me resulta pesado",
                        },
                        {
                            type: "predefined",
                            answer: "Baja, podría recibir más",
                        },
                    ],
                },
                confirmScreen: {
                    body: {
                        iconCode: "\ue815",
                        header: "¡Gracias!",
                        message: "Tus respuestas nos ayudan a mejorar",
                    },
                    confirm: "Volver a la app",
                },
            })
            .then((result) => console.log("Feedback:", result));
    }
}
