import { Injectable } from "@angular/core";
import { CommonComponentsModule } from "./common-components.module";
import {
    alert,
    AlertOptions,
    confirm,
    ConfirmOptions,
} from "tns-core-modules/ui/dialogs";

@Injectable({
    providedIn: CommonComponentsModule,
})
export class DialogsService {
    showInfo(title: string, confirmText: string, body: string = "") {
        const options: AlertOptions = {
            title,
            okButtonText: confirmText,
            message: body,
            cancelable: true,
        };
        alert(options).catch((e) =>
            console.error("Could not show info dialog. Reason:", e)
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
