import { Component, HostListener, NgZone } from "@angular/core";

import { Subject, takeUntil } from "rxjs";
import {
    appConfigController,
    ExtendedAreaOfInterest,
} from "~/app/core/account/app-config";

@Component({
    selector: "SymPlacesContainer",
    templateUrl: "./places-container.component.html",
    styleUrls: ["./places-container.component.scss"],
})
export class PlacesContainerComponent {
    places: Array<ExtendedAreaOfInterest>;
    selectedPlace: ExtendedAreaOfInterest;

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

    onPlaceSelected(place: ExtendedAreaOfInterest) {
        this.selectedPlace = place;
    }

    private subscribeToPlacesUpdates() {
        appConfigController.aois$
            .pipe(takeUntil(this.unloaded$))
            .subscribe((aois) => {
                this.ngZone.run(() => {
                    this.places = aois;
                });
            });
    }
}
