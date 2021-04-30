import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
    ButtonHAlignment,
    ButtonSize,
} from "../base-button/base-button.component";

@Component({
    selector: "SymPrimaryButton",
    templateUrl: "./primary-button.component.html",
    styleUrls: ["./primary-button.component.scss"],
})
export class PrimaryButtonComponent {
    @Input() text: string;
    @Input() flat: boolean;
    @Input() margin = 12;
    @Input() horizontalAlignment: ButtonHAlignment = "stretch";
    @Input() size: ButtonSize = "md";
    @Input() enabled = true;

    @Output() tap = new EventEmitter();

    onTap() {
        this.tap.emit();
    }
}
