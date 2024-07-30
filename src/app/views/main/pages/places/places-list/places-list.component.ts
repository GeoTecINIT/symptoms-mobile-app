import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewContainerRef,
} from "@angular/core";
import { ModalDialogOptions, ModalDialogService } from "@nativescript/angular";
import { PlacesListInfoDialogComponent } from "./places-list-item/places-list-info-dialog/places-list-info-dialog.component";
import { ItemEventData, ListView } from "@nativescript/core";
import { ExtendedAreaOfInterest } from "~/app/core/account/app-config";

@Component({
    selector: "SymPlacesList",
    templateUrl: "./places-list.component.html",
    styleUrls: ["./places-list.component.scss"],
})
export class PlacesListComponent {
    @Input() places: Array<ExtendedAreaOfInterest>;
    @Output() placeSelected = new EventEmitter<ExtendedAreaOfInterest>();
    vcRef: ViewContainerRef;

    expandedItemId: string = "";

    constructor(private modalService: ModalDialogService) {}

    ngOnChanges() {}

    onListItemTap(args: ItemEventData) {
        const listView = args.object as ListView;
        const tappedPlace = listView.items[
            args.index
        ] as ExtendedAreaOfInterest;

        if (this.expandedItemId === tappedPlace.id) {
            this.expandedItemId = "";
        } else {
            this.expandedItemId = tappedPlace.id;
        }

        this.placeSelected.emit(tappedPlace);
    }

    showInfoPopup() {
        const options: ModalDialogOptions = {
            context: {},
            fullscreen: false,
            viewContainerRef: this.vcRef,
        };

        this.modalService.showModal(PlacesListInfoDialogComponent, options);
    }
}
