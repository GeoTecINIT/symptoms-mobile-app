import { Component } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { ConfirmModalOptions } from "../options";

@Component({
    selector: "SymConfirmContainer",
    templateUrl: "./confirm-container.component.html",
    styleUrls: ["./confirm-container.component.scss"],
})
export class ConfirmContainerComponent {
    title = "";
    iconCode: string;
    emoji: string;
    bodyText = "";
    question = "";
    confirmText = "";
    cancelText = "";

    constructor(private params: ModalDialogParams) {
        const options = params.context as ConfirmModalOptions;
        this.title = options.title;

        this.iconCode = options.body.iconCode;
        this.emoji = options.body.emoji;
        this.bodyText = options.body.text;

        this.question = options.question;
        this.confirmText = options.buttons.confirm;
        this.cancelText = options.buttons.cancel;
    }

    onConfirmTap() {
        this.params.closeCallback(true);
    }

    onCancelTap() {
        this.params.closeCallback(false);
    }
}
