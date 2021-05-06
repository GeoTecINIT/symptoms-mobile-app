import { Injectable } from "@angular/core";
import { CommonComponentsModule } from "./common-components.module";
import {
    alert,
    AlertOptions,
    confirm,
    ConfirmOptions,
} from "@nativescript/core";
import { Logger, getLogger } from "~/app/core/utils/logger";

@Injectable({
    providedIn: CommonComponentsModule,
})
export class DialogsService {
    private logger: Logger;

    constructor() {
        this.logger = getLogger("DialogsService");
    }

    showInfo(
        title: string,
        confirmText: string,
        body: string = ""
    ): Promise<void> {
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

    askConfirmation(
        question: string,
        confirmText: string,
        negationText: string,
        description: string = ""
    ): Promise<boolean> {
        const options: ConfirmOptions = {
            title: question,
            okButtonText: confirmText,
            cancelButtonText: negationText,
            message: description,
            cancelable: false,
        };

        return confirm(options);
    }

    askConfirmationWithPositiveAction(
        question: string,
        positiveText: string,
        negativeText: string,
        description: string = ""
    ): Promise<boolean> {
        const options: ConfirmOptions = {
            title: question,
            okButtonText: positiveText,
            cancelButtonText: negativeText,
            message: description,
            cancelable: false,
        };

        return confirm(options).then((result) => !result);
    }

    askConfirmationWithDestructiveAction(
        question: string,
        destructiveText: string,
        cancelText: string,
        description: string = ""
    ): Promise<boolean> {
        const options: ConfirmOptions = {
            title: question,
            okButtonText: cancelText,
            cancelButtonText: destructiveText,
            message: description,
            cancelable: false,
        };

        return confirm(options).then((result) => !result);
    }
}
