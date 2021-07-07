import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Record } from "@geotecinit/emai-framework/entities";
import { PatientDataService } from "~/app/views/patient-data.service";
import { RecordType } from "~/app/core/record-type";
import { appEvents } from "~/app/core/app-events";
import { Application } from "@nativescript/core";

const APP_EVENTS_KEY = "AggregateListComponent";

@Component({
    selector: "SymAggregateList",
    templateUrl: "./aggregate-list.component.html",
    styleUrls: ["./aggregate-list.component.scss"],
})
export class AggregateListComponent implements OnInit, OnDestroy {
    aggregates: Array<Record>;

    private aggregatesSub: Subscription;

    constructor(
        private patientDataService: PatientDataService,
        private ngZone: NgZone
    ) {}

    ngOnInit() {
        this.subscribeToAggregateChanges();
        appEvents.on(Application.resumeEvent, APP_EVENTS_KEY, () => {
            this.subscribeToAggregateChanges();
        });
        appEvents.on(Application.suspendEvent, APP_EVENTS_KEY, () => {
            this.unsubscribeFromAggregateChanges();
        });
    }

    ngOnDestroy() {
        this.unsubscribeFromAggregateChanges();
    }

    private subscribeToAggregateChanges() {
        if (this.aggregatesSub) return;

        this.aggregatesSub = this.patientDataService
            .observeLatestGroupedRecordsByType(
                RecordType.ExposurePlaceAggregate,
                "placeId"
            )
            .subscribe((aggregates) => {
                this.ngZone.run(() => {
                    this.aggregates = aggregates;
                });
            });
    }

    private unsubscribeFromAggregateChanges() {
        if (!this.aggregatesSub) return;
        this.aggregatesSub.unsubscribe();
        this.aggregatesSub = undefined;
    }
}
