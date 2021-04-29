import { Component, OnInit } from "@angular/core";
import { ConfirmModalService } from "../../modals/confirm";
import { QuestionsModalService } from "../../modals/questions/questions-modal.service";
import { FeedbackModalService } from "../../modals/feedback/feedback-modal.service";

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

    onWantsToDeliverFeedback() {
        this.feedbackModalService
            .askFeedback()
            .then((result) => console.log("Feedback:", result));
    }
}
