import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: "SymNumericSelector",
    templateUrl: "./numeric-selector.component.html",
    styleUrls: ["./numeric-selector.component.scss"],
})
export class NumericSelectorComponent implements OnInit {
    @Input() from: number;
    @Input() to: number;

    @Input() height = "100%";
    @Input() width = "100%";
    @Input() selectedValue: number;

    @Output() valueChange = new EventEmitter<number>();

    values: Array<number>;
    selectedIndex: number;

    ngOnInit(): void {
        if (this.from === undefined || this.to === undefined) {
            throw new Error("Both 'from' and 'to' values must be provided");
        }
        if (typeof this.from !== "number" || typeof this.to !== "number") {
            throw new Error(
                "Both 'from' and 'to' values must be numbers. Have you used [arg]=\"value\" syntax?"
            );
        }
        if (this.from > this.to) {
            throw new Error("'from' value must be lower than 'to' value");
        }
        this.values = arrayRange(this.from, this.to);
        this.updateSelectedIndex();
    }

    onSelectedIndexChange(evt: any) {
        const valueIndex = evt.value as number;
        const value = this.values[valueIndex];
        this.valueChange.emit(value);
    }

    private updateSelectedIndex() {
        if (this.selectedValue !== undefined) {
            const index = this.values.indexOf(this.selectedValue);
            if (index !== -1) {
                this.selectedIndex = index;

                return;
            }
        }
        this.selectedIndex = 0;
    }
}

function arrayRange(from: number, to: number): Array<number> {
    return Array.from({ length: to - from + 1 }, (item, index) => index + from);
}
