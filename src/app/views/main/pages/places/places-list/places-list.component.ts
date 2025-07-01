import {
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
    ViewContainerRef,
} from "@angular/core";
import { ModalDialogOptions, ModalDialogService } from "@nativescript/angular";
import { PlacesListInfoDialogComponent } from "./places-list-item/places-list-info-dialog/places-list-info-dialog.component";
import { ItemEventData, ListView } from "@nativescript/core";
import { ExtendedAreaOfInterest } from "~/app/core/account/app-config";
import { Change } from "@awarns/core/entities";
import { FetchCondition, recordsStore } from "@awarns/persistence";
import { AppRecordType } from "~/app/core/app-record-type";

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

    ngOnChanges(changes: SimpleChanges) {
        if (changes["places"]) {
            this.loadExposureCounts();
        }
    }

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

    private loadExposureCounts(): void {
        const conditions: FetchCondition[] = [
            { property: "change", comparison: "=", value: Change.END },
            // { property: "successful", comparison: "=", value: true },
        ];

        recordsStore
            .listBy(AppRecordType.ExposureChange, "desc", conditions)
            .subscribe((records) => {
                const counts: Record<string, number> = {};
                records.forEach((r: any) => {
                    const id = r.place.id;
                    counts[id] = (counts[id] || 0) + 1;
                });

                this.places = (this.places ?? []).map((p) => ({
                    ...p,
                    exposures: counts[p.id] ?? 0,
                }));
            });
    }
}
