import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "SymButtonLink",
    templateUrl: "./button-link.component.html",
    styleUrls: ["./button-link.component.scss"],
})
export class ButtonLinkComponent {
    @Input() text = "";
    @Output() tap = new EventEmitter();

    onTap() {
        this.tap.emit();
    }
}
