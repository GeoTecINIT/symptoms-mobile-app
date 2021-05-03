import { Component } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { animate, style, transition, trigger } from "@angular/animations";
import { FeedbackModalOptions } from "~/app/views/main/modals/feedback/options";

@Component({
    selector: "SymFeedbackContainer",
    templateUrl: "./feedback-container.component.html",
    styleUrls: ["./feedback-container.component.scss"],
    animations: [
        trigger("slideUp", [
            transition(":enter", [
                style({ transform: "translateY(600%)" }),
                animate(
                    "300ms ease-in-out",
                    style({ transform: "translateY(0)" })
                ),
            ]),
        ]),
    ],
})
export class FeedbackContainerComponent {
    options: FeedbackModalOptions;
    answer: string;

    get showConfirmScreen(): boolean {
        return this.hasConfirmScreen && !!this.answer;
    }

    get hasConfirmScreen(): boolean {
        return !!this.options.confirmScreen;
    }

    constructor(private params: ModalDialogParams) {
        this.options = params.context as FeedbackModalOptions;
    }

    onClose() {
        this.params.closeCallback(this.answer);
    }

    onAnswer(answer: string) {
        this.answer = answer;
        if (!this.hasConfirmScreen) {
            this.onClose();
        }
    }
}
