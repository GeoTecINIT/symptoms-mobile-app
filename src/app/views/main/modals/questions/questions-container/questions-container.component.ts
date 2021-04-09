import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";

@Component({
    selector: "SymQuestionsContainer",
    templateUrl: "./questions-container.component.html",
    styleUrls: ["./questions-container.component.scss"],
})
export class QuestionsContainerComponent {
    constructor(private params: ModalDialogParams) {}

    onClose() {
        this.params.closeCallback();
    }
}
