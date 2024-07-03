import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "SymIconButton",
    templateUrl: "./icon-button.component.html",
    styleUrls: ["./icon-button.component.scss"],
})
export class IconButtonComponent {
    @Input() icon: string = '';
    @Input() danger: boolean = false;
    @Output() iconButtonTap = new EventEmitter<void>();

    emitTap() {
        this.iconButtonTap.emit();
    }
}
