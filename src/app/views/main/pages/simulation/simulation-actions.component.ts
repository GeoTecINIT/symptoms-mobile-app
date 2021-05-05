import { Component, OnInit } from "@angular/core";
import { ConfirmModalService } from "../../modals/confirm";
import { QuestionsModalService } from "../../modals/questions";
import { FeedbackModalService } from "../../modals/feedback";
import { getLogger, Logger } from "~/app/core/utils/logger";

import { confirmWantsToStartAnExposure } from "~/app/core/modals/confirm";
import {
    askForQuestionFrequencyFeedback,
    askWantsToLeaveFeedback,
} from "~/app/core/modals/feedback";

@Component({
    selector: "SymSimulationActions",
    templateUrl: "./simulation-actions.component.html",
    styleUrls: ["./simulation-actions.component.scss"],
})
export class SimulationActionsComponent implements OnInit {
    btnMargin = 4;

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
            .show(confirmWantsToStartAnExposure)
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
            .askFeedback(askWantsToLeaveFeedback)
            .then((result) => this.logger.debug(`Feedback: ${result}`))
            .catch((e) =>
                this.logger.error(`Could not deliver feedback: ${e}`)
            );
    }

    onWantsToDeliverFeedback() {
        this.feedbackModalService
            .askFeedback(askForQuestionFrequencyFeedback)
            .then((result) => this.logger.debug(`Feedback: ${result}`))
            .catch((e) =>
                this.logger.error(`Could not deliver feedback: ${e}`)
            );
    }
}
