import { Component } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";

@Component({
    selector: "SymFeedbackContainer",
    templateUrl: "./feedback-container.component.html",
    styleUrls: ["./feedback-container.component.scss"],
})
export class FeedbackContainerComponent {
    constructor(private params: ModalDialogParams) {}

    onClose() {
        this.params.closeCallback(undefined);
    }

    onAnswer(answer: string) {
        this.params.closeCallback(answer);
    }
}
