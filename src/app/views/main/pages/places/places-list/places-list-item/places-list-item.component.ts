import { Component, Input } from "@angular/core";
import { AreaOfInterest } from "@awarns/core/entities/aois";

@Component({
    selector: "SymPlacesListItem",
    templateUrl: "./places-list-item.component.html",
    styleUrls: ["./places-list-item.component.scss"],
})
export class PlacesListItemComponent {
    @Input() place: AreaOfInterest;
}
