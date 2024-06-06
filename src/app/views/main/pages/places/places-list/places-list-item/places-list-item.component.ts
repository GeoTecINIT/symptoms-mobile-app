import { Component, Input, NgZone, HostListener } from "@angular/core";
import { AreaOfInterest } from "@awarns/geofencing";
import { Record, Change } from "@awarns/core/entities";

import { Subject, takeUntil } from "rxjs";
import { AppRecordType } from "~/app/core/app-record-type";
import { FetchCondition, recordsStore } from "@awarns/persistence";

@Component({
    selector: "SymPlacesListItem",
    templateUrl: "./places-list-item.component.html",
    styleUrls: ["./places-list-item.component.scss"],
})
export class PlacesListItemComponent {
    @Input() place: AreaOfInterest;

    records: Array<Record> = [];

    private unloaded$ = new Subject<void>();

    constructor(private ngZone: NgZone) {}

    @HostListener("loaded")
    onLoaded() {
        this.subscribeToRecordChanges();
    }

    @HostListener("unloaded")
    onUnloaded() {
        this.unloaded$.next();
    }

    private subscribeToRecordChanges() {
        console.log("Place id 👉👉👉", this.place.id)
        const conditions: Array<FetchCondition> = [
            { property: "change", comparison: "=", value: Change.END },
            { property: "successful", comparison: "=", value: true },
            { property: "place.id", comparison: "=", value: this.place.id }
        ];
        recordsStore
            .listBy(AppRecordType.ExposureChange, "desc", conditions)
            .pipe(takeUntil(this.unloaded$))
            .subscribe((records) => {
                this.ngZone.run(() => {
                    this.records = records;
                });
            });
    }

    get numberOfExposures(): number {
        return this.records.length;
    }
}
