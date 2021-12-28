import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { EventData, Label } from "@nativescript/core";

@Component({
    selector: "SymBinaryChoice",
    templateUrl: "./binary-choice.component.html",
    styleUrls: ["./binary-choice.component.scss"],
})
export class BinaryChoiceComponent implements OnInit {
    @Input() left = "";
    @Input() right = "";
    @Input() defaultOption: string;

    @Input() marginTop = 0;
    @Input() marginBottom = 0;

    @Output() optionSelected = new EventEmitter<string>();

    selectedOption: string;

    ngOnInit() {
        if (!this.defaultOption) return;
        if (
            this.defaultOption === this.left ||
            this.defaultOption === this.right
        ) {
            this.updateSelectedOption(this.defaultOption);
        }
    }

    onOptionSelected(args: EventData) {
        const label = args.object as Label;
        this.updateSelectedOption(label.text);
    }

    private updateSelectedOption(value: string) {
        this.selectedOption = value;
        this.optionSelected.emit(this.selectedOption);
    }
}
