import { Component, Input } from "@angular/core";

@Component({
    selector: "SymContextualConditionItem",
    templateUrl: "./contextual-condition-item.component.html",
    styleUrls: ["./contextual-condition-item.component.scss"],
})
export class ContextualConditionItem {
    @Input() title: string = "";
    @Input() configuredCondition: string = "";
    @Input() receivedCondition: string = "";
    @Input() timeIsWithinRange: boolean;

    get isConditionMatching() {
        if (this.timeIsWithinRange !== undefined) return this.timeIsWithinRange;

        return (
            this.configuredCondition === this.receivedCondition ||
            this.receivedCondition.includes(this.configuredCondition)
        );
    }

    get showConditionItem() {
        return this.configuredCondition !== "" && this.receivedCondition !== "";
    }
}
