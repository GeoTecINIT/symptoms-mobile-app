import { Component, HostListener, NgZone } from "@angular/core";

import { Subject } from "rxjs";
import { AreaOfInterest, areasOfInterest } from "@awarns/geofencing";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "SymPlacesContainer",
    templateUrl: "./places-container.component.html",
    styleUrls: ["./places-container.component.scss"],
})
export class PlacesContainerComponent {
    places: Array<AreaOfInterest>;
    selectedPlace: AreaOfInterest;

    private unloaded$ = new Subject<void>();

    constructor(private ngZone: NgZone) {}

    @HostListener("loaded")
    onLoaded() {
        this.subscribeToPlacesUpdates();
    }

    @HostListener("unloaded")
    onUnloaded() {
        this.unloaded$.next();
    }

    onPlaceSelected(place: AreaOfInterest) {
        this.selectedPlace = place;
    }

    private subscribeToPlacesUpdates() {
        areasOfInterest
            .list()
            .pipe(takeUntil(this.unloaded$))
            .subscribe((places) => {
                this.ngZone.run(() => {
                    this.places = places;
                });
            });
    }
}
