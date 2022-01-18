import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "SymProgressSection",
    templateUrl: "./progress-section.component.html",
    styleUrls: ["./progress-section.component.scss"],
})
export class ProgressSectionComponent {
    @Input() title = "";
    @Input() btnText = "";
    @Input() btnActive = true;

    @Output() btnTap = new EventEmitter();

    onBtnTap() {
        this.btnTap.emit();
    }
}
