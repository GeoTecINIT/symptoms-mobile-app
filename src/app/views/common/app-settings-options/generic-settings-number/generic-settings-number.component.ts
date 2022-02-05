import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
    inputType,
    PromptOptions,
    PromptResult,
    prompt,
} from "@nativescript/core";

@Component({
    selector: "SymGenericSettingsNumber",
    templateUrl: "./generic-settings-number.component.html",
    styleUrls: ["./generic-settings-number.component.scss"],
})
export class GenericSettingsNumberComponent {
    @Input() text = "";
    @Input()
    set value(num: number) {
        this.currentValue = num;
    }
    @Input() unit: string;
    @Input() min: number;

    @Input() bold = false;
    @Input() italic = false;
    @Input() marginBottom: number;

    @Output() valueChange = new EventEmitter<number>();

    currentValue: number;

    onWantsToUpdateValue() {
        const minText = this.min !== undefined ? ` (min: ${this.min})` : "";
        const options: PromptOptions = {
            title: `Introduce un nuevo valor${minText}`,
            defaultText: `${this.currentValue}`,
            okButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
            cancelable: true,
            inputType: inputType.number,
        };

        prompt(options).then((result: PromptResult) => {
            if (!result.result) return;

            const newValue = parseFloat(result.text);
            if (newValue < this.min) return;

            this.currentValue = newValue;
            this.valueChange.emit(newValue);
        });
    }
}
