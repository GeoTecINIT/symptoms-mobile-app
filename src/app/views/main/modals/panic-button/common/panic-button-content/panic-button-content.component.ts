import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "SymPanicButtonContent",
    templateUrl: "./panic-button-content.component.html",
    styleUrls: ["./panic-button-content.component.scss"],
})
export class PanicButtonContentComponent {
    @Input() iconCode: string;
    @Input() title: string;
    @Input() body: string;
    @Input() btnText: string;

    @Output() btnTap = new EventEmitter<void>();

    onButtonTapped() {
        this.btnTap.emit();
    }
}
