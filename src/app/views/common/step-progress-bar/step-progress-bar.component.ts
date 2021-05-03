import { Component, Input } from "@angular/core";

@Component({
    selector: "SymStepProgressBar",
    templateUrl: "./step-progress-bar.component.html",
    styleUrls: ["./step-progress-bar.component.scss"],
})
export class StepProgressBarComponent {
    @Input() current: number;
    @Input() total: number;

    get segments(): Array<string> {
        if (this.total === undefined) return [];

        return Array.from({ length: this.total }, () => "*");
    }

    get columns() {
        return this.segments.join(",");
    }
}
