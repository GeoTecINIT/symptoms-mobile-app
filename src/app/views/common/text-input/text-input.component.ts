import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EventData, TextField } from "@nativescript/core";

type ReturnKeyType = "done" | "next" | "go" | "search" | "send";

@Component({
    selector: "SymTextInput",
    templateUrl: "./text-input.component.html",
    styleUrls: ["./text-input.component.scss"],
})
export class TextInputComponent {
    @Input() text = "";
    @Input() returnKeyType: ReturnKeyType = "done";
    @Input() hint = "";
    @Input() helpText = "";

    @Input() marginTop = 0;
    @Input() marginBottom = 0;

    @Output() textChanged = new EventEmitter<string>();
    @Output() returnKeyPressed = new EventEmitter<void>();

    focus = false;

    onFieldFocus() {
        this.focus = true;
    }

    onFieldBlur() {
        this.focus = false;
    }

    onReturnPressed() {
        this.returnKeyPressed.emit();
    }

    onFieldTextChange(args: EventData) {
        const textField = args.object as TextField;
        this.textChanged.emit(textField.text);
    }
}
