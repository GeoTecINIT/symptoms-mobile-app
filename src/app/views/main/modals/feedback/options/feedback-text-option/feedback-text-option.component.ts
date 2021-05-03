import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EventData, TextField } from "@nativescript/core";

@Component({
    selector: "SymFeedbackTextOption",
    templateUrl: "./feedback-text-option.component.html",
    styleUrls: ["./feedback-text-option.component.scss"],
})
export class FeedbackTextOptionComponent {
    @Input() hint = "";
    @Output() answerProvided = new EventEmitter<string>();
    @Input() helpText = "";
    answer: string;
    focus = false;

    onConfirmTap() {
        if (this.answer === undefined || this.answer.trim() === "") return;
        this.answerProvided.emit(this.answer);
    }

    onFieldFocus() {
        this.focus = true;
    }

    onFieldBlur() {
        this.focus = false;
    }

    onFieldTextChange(args: EventData) {
        const textField = args.object as TextField;
        this.answer = textField.text;
    }
}
