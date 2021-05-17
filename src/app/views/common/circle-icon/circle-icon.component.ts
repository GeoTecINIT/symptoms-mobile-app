import { Component, Input } from "@angular/core";

@Component({
    selector: "SymCircleIcon",
    templateUrl: "./circle-icon.component.html",
    styleUrls: ["./circle-icon.component.scss"],
})
export class CircleIconComponent {
    @Input() iconCode: string;
}
