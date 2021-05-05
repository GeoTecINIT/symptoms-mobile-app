import { Component, Input } from "@angular/core";

export type ButtonHAlignment = "left" | "right" | "center" | "stretch";
export type ButtonSize = "lg" | "md" | "sm";
export type ButtonVariant = "primary" | "secondary" | "confirm" | "danger";

@Component({
    selector: "SymBaseButton",
    templateUrl: "./base-button.component.html",
    styleUrls: ["./base-button.component.scss"],
})
export class BaseButtonComponent {
    @Input() variant: ButtonVariant = "primary";
    @Input() text = "";
    @Input() flat = false;
    @Input() margin = 12;
    @Input() horizontalAlignment: ButtonHAlignment = "stretch";
    @Input() size: ButtonSize = "md";
    @Input() enabled = true;

    get primary(): boolean {
        return this.variant === "primary";
    }

    get secondary(): boolean {
        return this.variant === "secondary";
    }

    get confirm(): boolean {
        return this.variant === "confirm";
    }

    get danger(): boolean {
        return this.variant === "danger";
    }
}
