import { Component, OnInit } from "@angular/core";
import { ConfirmModalService } from "../../modals/confirm/confirm-modal.service";
import { QuestionsModalService } from "../../modals/questions/questions-modal.service";
import { FeedbackModalService } from "~/app/views/main/modals/feedback/feedback-modal.service";

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
            .show()
            .catch((e) => console.error("Could not show confirm modal:", e));
    }

    onWantsToAnswerQuestions() {
        this.questionsModalService.deliverQuestions();
    }

    onWantsToDeliverFeedback() {
        this.feedbackModalService.askFeedback();
    }
}
