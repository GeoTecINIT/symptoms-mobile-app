import { Component } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { FeedbackModalOptions } from "~/app/core/modals/feedback";

@Component({
    selector: "SymFeedbackContainer",
    templateUrl: "./feedback-container.component.html",
    styleUrls: ["./feedback-container.component.scss"],
})
export class FeedbackContainerComponent {
    options: FeedbackModalOptions;
    answer: string;
    showConfirmScreen = false;

    get hasCompletionScreen(): boolean {
        return !!this.options.completionScreen;
    }

    constructor(private params: ModalDialogParams) {
        this.options = params.context as FeedbackModalOptions;
    }

    onClose() {
        this.params.closeCallback(this.answer);
    }

    onAnswer(answer: string) {
        this.answer = answer;
        if (this.hasCompletionScreen) {
            this.showConfirmScreen = true;
        } else {
            this.onClose();
        }
    }
}
