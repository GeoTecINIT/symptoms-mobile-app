import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "SymCloseActionBar",
    templateUrl: "./close-action-bar.component.html",
    styleUrls: ["./close-action-bar.component.scss"],
})
export class CloseActionBarComponent {
    @Input() title: string;
    @Output() close = new EventEmitter();

    onClose() {
        this.close.emit();
    }
}
