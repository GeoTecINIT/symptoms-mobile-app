import { Component } from "@angular/core";

import { ModalDialogParams } from "@nativescript/angular";

import { DialogsService } from "~/app/views/common/dialogs.service";

import { ConfirmModalOptions } from "../options";

@Component({
    selector: "SymConfirmContainer",
    templateUrl: "./confirm-container.component.html",
    styleUrls: ["./confirm-container.component.scss"],
})
export class ConfirmContainerComponent {
    options: ConfirmModalOptions;

    get hasCancelConfirm(): boolean {
        return this.options.cancelConfirm !== undefined;
    }

    constructor(
        private params: ModalDialogParams,
        private dialogsService: DialogsService
    ) {
        this.options = params.context as ConfirmModalOptions;
    }

    onConfirmTap() {
        this.params.closeCallback(true);
    }

    onCancelTap() {
        if (!this.hasCancelConfirm) {
            this.params.closeCallback(false);

            return;
        }

        const {
            question,
            positiveText,
            negativeText,
            description,
        } = this.options.cancelConfirm;
        this.dialogsService
            .askConfirmationWithPositiveAction(
                question,
                positiveText,
                negativeText,
                description
            )
            .then((confirms) => {
                if (confirms) this.params.closeCallback(false);
            });
    }
}
