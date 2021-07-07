import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Record } from "@geotecinit/emai-framework/entities";
import { PatientDataService } from "~/app/views/patient-data.service";
import { RecordType } from "~/app/core/record-type";
import { Change } from "@geotecinit/emai-framework/internal/providers";
import { appEvents } from "~/app/core/app-events";
import { Application } from "@nativescript/core";

const APP_EVENTS_KEY = "RecordsListComponent";

@Component({
    selector: "SymRecordsList",
    templateUrl: "./records-list.component.html",
    styleUrls: ["./records-list.component.scss"],
})
export class RecordsListComponent implements OnInit, OnDestroy {
    records: Array<Record>;

    private recordsSub: Subscription;

    constructor(
        private patientDataService: PatientDataService,
        private ngZone: NgZone
    ) {}

    ngOnInit() {
        this.subscribeToRecordChanges();
        appEvents.on(Application.resumeEvent, APP_EVENTS_KEY, () => {
            this.subscribeToRecordChanges();
        });
        appEvents.on(Application.suspendEvent, APP_EVENTS_KEY, () => {
            this.unsubscribeFromRecordChanges();
        });
    }

    ngOnDestroy() {
        this.unsubscribeFromRecordChanges();
    }

    private subscribeToRecordChanges() {
        if (this.recordsSub) return;

        this.recordsSub = this.patientDataService
            .observeRecordsByType(RecordType.ExposureChange, [
                { property: "change", comparison: "=", value: Change.END },
                { property: "successful", comparison: "=", value: true },
            ])
            .subscribe((records) => {
                this.ngZone.run(() => {
                    this.records = records;
                });
            });
    }

    private unsubscribeFromRecordChanges() {
        if (!this.recordsSub) return;
        this.recordsSub.unsubscribe();
        this.recordsSub = undefined;
    }
}
