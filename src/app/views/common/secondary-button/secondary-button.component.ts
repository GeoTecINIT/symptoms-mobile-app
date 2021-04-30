import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
    ButtonHAlignment,
    ButtonSize,
} from "../base-button/base-button.component";

@Component({
    selector: "SymSecondaryButton",
    templateUrl: "./secondary-button.component.html",
    styleUrls: ["./secondary-button.component.scss"],
})
export class SecondaryButtonComponent {
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
