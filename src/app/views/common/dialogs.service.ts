import { Injectable } from "@angular/core";
import {
    alert,
    AlertOptions,
    confirm,
    ConfirmOptions,
} from "@nativescript/core";

import { Logger, getLogger } from "~/app/core/utils/logger";

import { InfoDialogOptions } from "~/app/core/dialogs/info";
import { ConfirmDialogOptions } from "~/app/core/dialogs/confirm";

@Injectable({
    providedIn: "root",
})
export class DialogsService {
    private logger: Logger;

    constructor() {
        this.logger = getLogger("DialogsService");
    }

    showInfo({ title, body, confirmText }: InfoDialogOptions): Promise<void> {
        const options: AlertOptions = {
            title,
            okButtonText: confirmText,
            message: body,
            cancelable: true,
        };

        return alert(options).catch((e) =>
            this.logger.error(`Could not show info dialog. Reason: ${e}`)
        );
    }

    askConfirmation({
        question,
        positiveText,
        negativeText,
        body,
    }: ConfirmDialogOptions): Promise<boolean> {
        const options: ConfirmOptions = {
            title: question,
            okButtonText: positiveText,
            cancelButtonText: negativeText,
            message: body,
            cancelable: false,
        };

        return confirm(options);
    }

    askConfirmationWithPositiveAction({
        question,
        positiveText,
        negativeText,
        body,
    }: ConfirmDialogOptions): Promise<boolean> {
        const options: ConfirmOptions = {
            title: question,
            okButtonText: positiveText,
            cancelButtonText: negativeText,
            message: body,
            cancelable: false,
        };

        return confirm(options).then((result) => !result);
    }

    askConfirmationWithDestructiveAction({
        question,
        positiveText,
        negativeText,
        body,
    }: ConfirmDialogOptions): Promise<boolean> {
        const options: ConfirmOptions = {
            title: question,
            okButtonText: negativeText,
            cancelButtonText: positiveText,
            message: body,
            cancelable: false,
        };

        return confirm(options).then((result) => !result);
    }
}
