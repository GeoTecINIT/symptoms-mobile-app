import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";

import { PatientDataService } from "~/app/views/patient-data.service";
import { ExposureChange } from "~/app/tasks/exposure";
import { RecordType } from "~/app/core/record-type";
import { Change } from "@geotecinit/emai-framework/entities";

@Component({
    selector: "SymProgressContainer",
    templateUrl: "./progress-container.component.html",
    styleUrls: ["./progress-container.component.scss"],
})
export class ProgressContainerComponent implements OnInit, OnDestroy {
    idle: boolean;
    underExposure: boolean;

    private exposureChangeSubscription?: Subscription;

    constructor(
        private patientDataService: PatientDataService,
        private ngZone: NgZone
    ) {}

    ngOnInit() {
        this.exposureChangeSubscription = this.patientDataService
            .observeLastByRecordType<ExposureChange>(RecordType.ExposureChange)
            .pipe(
                map(
                    (exposureChange) =>
                        !exposureChange || exposureChange.change === Change.END
                )
            )
            .subscribe((idle) => {
                this.ngZone.run(() => {
                    this.idle = idle;
                    this.underExposure = !idle;
                });
            });
    }

    ngOnDestroy() {
        this.exposureChangeSubscription?.unsubscribe();
    }
}
