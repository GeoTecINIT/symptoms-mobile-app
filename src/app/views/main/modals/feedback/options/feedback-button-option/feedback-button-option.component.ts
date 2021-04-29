import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "SymFeedbackButtonOption",
    templateUrl: "./feedback-button-option.component.html",
    styleUrls: ["./feedback-button-option.component.scss"],
})
export class FeedbackButtonOptionComponent {
    @Input() text = "";
    @Output() optionTap = new EventEmitter<string>();

    onTap() {
        this.optionTap.emit(this.text);
    }
}
