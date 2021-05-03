import { Component, Input } from "@angular/core";

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
}
