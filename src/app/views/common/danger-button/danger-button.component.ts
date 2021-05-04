import { Component, Input } from "@angular/core";
import {
    ButtonHAlignment,
    ButtonSize,
} from "../base-button/base-button.component";

@Component({
    selector: "SymDangerButton",
    templateUrl: "./danger-button.component.html",
    styleUrls: ["./danger-button.component.scss"],
})
export class DangerButtonComponent {
    @Input() text: string;
    @Input() flat: boolean;
    @Input() margin = 12;
    @Input() horizontalAlignment: ButtonHAlignment = "stretch";
    @Input() size: ButtonSize = "md";
    @Input() enabled = true;
}
