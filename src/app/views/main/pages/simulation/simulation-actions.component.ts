import { Component, OnInit } from "@angular/core";
import { ConfirmModalService } from "../../modals/confirm";
import { QuestionsModalService } from "../../modals/questions";
import { FeedbackModalService } from "../../modals/feedback";
import { getLogger, Logger } from "~/app/core/utils/logger";

@Component({
    selector: "SymSimulationActions",
    templateUrl: "./simulation-actions.component.html",
    styleUrls: ["./simulation-actions.component.scss"],
})
export class SimulationActionsComponent implements OnInit {
    private logger: Logger;

    constructor(
        private confirmModalService: ConfirmModalService,
        private questionsModalService: QuestionsModalService,
        private feedbackModalService: FeedbackModalService
    ) {
        this.logger = getLogger("SimulationActionsComponent");
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
                cancelConfirm: {
                    question: "¿Te vas?",
                    description:
                        "No deberías abandonar una exposición salvo por causa mayor. Recuerda el papel negativo de la evitación. Es normal que tengas picos de ansiedad. Si te quedas, acabarás controlándolos.",
                    positiveText: "Me quedo",
                    negativeText: "Salir",
                },
            })
            .then((result) => this.logger.debug(`Result: ${result}`))
            .catch((e) =>
                this.logger.error(`Could not show confirm modal: ${e}`)
            );
    }

    onWantsToAnswerQuestions() {
        this.questionsModalService
            .deliverQuestions({
                title: "¿Cómo te encuentras?",
                body: {
                    iconCode: "\ue94c",
                    text:
                        "Por favor, responde con sinceridad. Al hacerlo me ayudas a saber mejor cómo te encuentras",
                },
                questions: [
                    {
                        title:
                            "De 0 a 10, ¿cómo puntuarías tu nivel de ansiedad actual?",
                        type: "range",
                        from: 0,
                        to: 10,
                    },
                    {
                        title:
                            "De 0 a 10, ¿cómo puntuarías las ganas que tienes de salir de aquí?",
                        type: "range",
                        from: 0,
                        to: 10,
                    },
                    {
                        title:
                            "De 0 a 10, ¿cómo puntuarías tu grado de creencia en pensamientos?",
                        type: "range",
                        from: 0,
                        to: 10,
                    },
                ],
            })
            .then((answers) =>
                this.logger.debug(`Got answers: ${JSON.stringify(answers)}`)
            )
            .catch((e) =>
                this.logger.error(`Could not deliver questions: ${e}`)
            );
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
            .then((result) => this.logger.debug(`Feedback: ${result}`))
            .catch((e) =>
                this.logger.error(`Could not deliver feedback: ${e}`)
            );
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
            .then((result) => this.logger.debug(`Feedback: ${result}`))
            .catch((e) =>
                this.logger.error(`Could not deliver feedback: ${e}`)
            );
    }
}
