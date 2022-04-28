import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AreaOfInterest } from "@awarns/core/entities/aois";

@Component({
    selector: "SymPlacesList",
    templateUrl: "./places-list.component.html",
    styleUrls: ["./places-list.component.scss"],
})
export class PlacesListComponent {
    @Input() places: Array<AreaOfInterest>;
    @Output() placeSelected = new EventEmitter<AreaOfInterest>();

    onListItemTap(args: any) {
        this.placeSelected.emit(this.places[args.index]);
    }
}
