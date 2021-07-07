import { Component, HostListener, NgZone } from "@angular/core";
import { Subject } from "rxjs";
import { Record } from "@geotecinit/emai-framework/entities";
import { PatientDataService } from "~/app/views/patient-data.service";
import { RecordType } from "~/app/core/record-type";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "SymAggregateList",
    templateUrl: "./aggregate-list.component.html",
    styleUrls: ["./aggregate-list.component.scss"],
})
export class AggregateListComponent {
    aggregates: Array<Record>;

    private unloaded$ = new Subject();

    constructor(
        private patientDataService: PatientDataService,
        private ngZone: NgZone
    ) {}

    @HostListener("loaded")
    onLoaded() {
        this.subscribeToAggregateChanges();
    }

    @HostListener("unloaded")
    onUnloaded() {
        this.unloaded$.next();
    }

    private subscribeToAggregateChanges() {
        this.patientDataService
            .observeLatestGroupedRecordsByType(
                RecordType.ExposurePlaceAggregate,
                "placeId"
            )
            .pipe(takeUntil(this.unloaded$))
            .subscribe((aggregates) => {
                this.ngZone.run(() => {
                    this.aggregates = aggregates;
                });
            });
    }
}
