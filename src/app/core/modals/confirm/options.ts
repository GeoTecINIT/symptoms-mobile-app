import { ConfirmDialogOptions } from "~/app/core/dialogs/confirm";

export interface ConfirmModalOptions {
    title: string;
    body: {
        emoji?: string;
        iconCode?: string;
        text: string;
    };
    question: string;
    buttons: {
        confirm: string;
        cancel: string;
    };
    cancelConfirmOptions?: ConfirmDialogOptions;
}
