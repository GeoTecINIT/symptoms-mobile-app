import { Component, EventEmitter, Input, Output } from "@angular/core";

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

    secure = true;
    focused = false;

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
    }
}
