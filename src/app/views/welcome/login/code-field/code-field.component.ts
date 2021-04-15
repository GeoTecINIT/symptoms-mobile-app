import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EventData, isAndroid, isIOS, TextField } from "@nativescript/core";

@Component({
    selector: "SymCodeField",
    templateUrl: "./code-field.component.html",
    styleUrls: ["./code-field.component.scss"],
})
export class CodeFieldComponent {
    @Input() hint = "";
    @Input() marginBottom: number;
    @Input() maxLength: number = Number.POSITIVE_INFINITY;
    @Input() error = "";

    @Output() textChange = new EventEmitter<string>();
    @Output() returnPress = new EventEmitter();

    focused = false;
    secure = true;

    private textField: TextField;
    private typeface: any;

    onFieldLoaded(args: EventData) {
        this.textField = args.object as TextField;
        if (isAndroid) {
            this.typeface = this.textField.android.getTypeface();
            this.updateVisibility();
        }
    }

    onFieldFocus() {
        this.focused = true;
    }

    onFieldBlur() {
        this.focused = false;
    }

    onFieldTextChange(evt: any) {
        this.textChange.emit(evt.object.text);
    }

    onFieldReturnPress() {
        this.returnPress.emit();
    }

    onToggleVisibility() {
        this.secure = !this.secure;
        if (isIOS) {
            this.textField.secure = this.secure;
        } else if (isAndroid && this.typeface) {
            this.updateVisibility();
        }
    }

    private updateVisibility() {
        const androidTextField = this.textField.android;
        androidTextField.setInputType(
            this.secure ? 129 /* password */ : 16385 /* plain text */
        );
        androidTextField.setTypeface(this.typeface);
        androidTextField.setSelection(androidTextField.length());
    }
}
