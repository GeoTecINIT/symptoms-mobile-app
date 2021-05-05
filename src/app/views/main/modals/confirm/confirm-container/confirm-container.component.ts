import { Component } from "@angular/core";

import { ModalDialogParams } from "@nativescript/angular";
import { DialogsService } from "~/app/views/common/dialogs.service";
import { ConfirmModalOptions } from "~/app/core/modals/confirm";

@Component({
    selector: "SymConfirmContainer",
    templateUrl: "./confirm-container.component.html",
    styleUrls: ["./confirm-container.component.scss"],
})
export class ConfirmContainerComponent {
    options: ConfirmModalOptions;

    get hasCancelConfirm(): boolean {
        return this.options.cancelConfirmOptions !== undefined;
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

        this.dialogsService
            .askConfirmationWithPositiveAction(
                this.options.cancelConfirmOptions
            )
            .then((confirms) => {
                if (confirms) this.params.closeCallback(false);
            });
    }
}
