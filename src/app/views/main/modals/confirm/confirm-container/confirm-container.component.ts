import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";

@Component({
    selector: "SymConfirmContainer",
    templateUrl: "./confirm-container.component.html",
    styleUrls: ["./confirm-container.component.scss"],
})
export class ConfirmContainerComponent {
    constructor(private params: ModalDialogParams) {}

    onClose() {
        this.params.closeCallback();
    }
}
