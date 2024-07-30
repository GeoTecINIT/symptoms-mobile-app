import { Component, Input } from "@angular/core";
import { FormatedContextualCondition } from "../places-list-item.component";

@Component({
    selector: "SymPlacesListItemCondition",
    templateUrl: "./places-list-item-condition.component.html",
    styleUrls: ["./places-list-item-condition.component.scss"],
})
export class PlacesListItemConditionComponent {
    @Input() condition: FormatedContextualCondition;
}
