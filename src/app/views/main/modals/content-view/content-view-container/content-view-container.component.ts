import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";

@Component({
    selector: "SymContentViewContainer",
    templateUrl: "./content-view-container.component.html",
    styleUrls: ["./content-view-container.component.scss"],
})
export class ContentViewContainerComponent {
    id: string;

    constructor(private params: ModalDialogParams) {
        this.id = params.context.id;
    }

    onClose() {
        this.params.closeCallback();
    }
}
