import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Switch } from "@nativescript/core";

@Component({
    selector: "SymGenericSettingsOption",
    templateUrl: "./generic-settings-option.component.html",
    styleUrls: ["./generic-settings-option.component.scss"],
})
export class GenericSettingsOptionComponent {
    @Input() text = "";
    @Input() checked: boolean;
    @Input() bold = false;
    @Input() italic = false;
    @Input() marginBottom: number;

    @Output() checkedChange = new EventEmitter<boolean>();

    onCheckChange(args: any) {
        if (typeof this.checked === "undefined") return;

        const sw = args.object as Switch;
        const checked = sw.checked;
        this.checked = checked;
        this.checkedChange.emit(checked);
    }
}
