import { Component, HostListener, NgZone } from "@angular/core";
import { Subject } from "rxjs";
import { Record } from "@geotecinit/emai-framework/entities";
import { PatientDataService } from "~/app/views/patient-data.service";
import { RecordType } from "~/app/core/record-type";
import { Change } from "@geotecinit/emai-framework/internal/providers";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "SymRecordsList",
    templateUrl: "./records-list.component.html",
    styleUrls: ["./records-list.component.scss"],
})
export class RecordsListComponent {
    records: Array<Record>;

    private unloaded$ = new Subject();

    constructor(
        private patientDataService: PatientDataService,
        private ngZone: NgZone
    ) {}

    @HostListener("loaded")
    onLoaded() {
        this.subscribeToRecordChanges();
    }

    @HostListener("unloaded")
    onUnloaded() {
        this.unloaded$.next();
    }

    private subscribeToRecordChanges() {
        this.patientDataService
            .observeRecordsByType(RecordType.ExposureChange, [
                { property: "change", comparison: "=", value: Change.END },
                { property: "successful", comparison: "=", value: true },
            ])
            .pipe(takeUntil(this.unloaded$))
            .subscribe((records) => {
                this.ngZone.run(() => {
                    this.records = records;
                });
            });
    }
}
