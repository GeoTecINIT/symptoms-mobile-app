import { Component, Input } from "@angular/core";

type CommonAlignmentOpts = "center" | "stretch";
type VerticalAlignmentOpts = CommonAlignmentOpts | "bottom" | "middle" | "top";
type HorizontalAlignmentOpts = CommonAlignmentOpts | "right" | "left";

@Component({
    selector: "SymBaseCard",
    templateUrl: "./base-card.component.html",
    styleUrls: ["./base-card.component.scss"],
})
export class BaseCardComponent {
    @Input() horizontalAlignment: HorizontalAlignmentOpts = "right";
    @Input() verticalAlignment: VerticalAlignmentOpts = "top";
}
