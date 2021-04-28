import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "SymButtonLink",
    templateUrl: "./button-link.component.html",
    styleUrls: ["./button-link.component.scss"],
})
export class ButtonLinkComponent {
    @Input() text = "";
    @Input() margin = 10;
    @Input() horizontalAlignment: "left" | "right" | "center" | "stretch" =
        "stretch";
    @Output() tap = new EventEmitter();

    onTap() {
        this.tap.emit();
    }
}
