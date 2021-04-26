import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "SymPrimaryButton",
    templateUrl: "./primary-button.component.html",
    styleUrls: ["./primary-button.component.scss"],
})
export class PrimaryButtonComponent {
    @Input() text = "";
    @Input() flat = false;
    @Input() margin = 12;
    @Input() horizontalAlignment: "left" | "right" | "center" | "stretch" =
        "stretch";
    @Input() size: "lg" | "md" | "sm" = "md";
    @Input() enabled = true;

    @Output() tap = new EventEmitter();

    onTap() {
        this.tap.emit();
    }
}
