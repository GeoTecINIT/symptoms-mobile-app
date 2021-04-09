import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";

@Component({
    selector: "SymFeedbackContainer",
    templateUrl: "./feedback-container.component.html",
    styleUrls: ["./feedback-container.component.scss"],
})
export class FeedbackContainerComponent {
    constructor(private params: ModalDialogParams) {}

    onClose() {
        this.params.closeCallback();
    }
}
