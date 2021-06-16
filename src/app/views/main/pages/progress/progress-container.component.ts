import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { map, tap } from "rxjs/operators";

import { PatientDataService } from "~/app/views/patient-data.service";
import { ExposureChange } from "~/app/tasks/exposure";
import { RecordType } from "~/app/core/record-type";
import { Change } from "@geotecinit/emai-framework/entities";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { appEvents } from "~/app/core/app-events";
import { Application } from "@nativescript/core";

const APP_EVENTS_KEY = "ProgressContainer";

@Component({
    selector: "SymProgressContainer",
    templateUrl: "./progress-container.component.html",
    styleUrls: ["./progress-container.component.scss"],
})
export class ProgressContainerComponent implements OnInit, OnDestroy {
    idle: boolean;
    underExposure: boolean;

    private exposureChangeSubscription?: Subscription;
    private logger: Logger;

    constructor(
        private patientDataService: PatientDataService,
        private ngZone: NgZone
    ) {
        this.logger = getLogger("ProgressContainer");
    }

    ngOnInit() {
        this.subscribeToExposureChanges();
        appEvents.on(Application.resumeEvent, APP_EVENTS_KEY, () => {
            this.subscribeToExposureChanges();
        });

        appEvents.on(Application.resumeEvent, APP_EVENTS_KEY, () => {
            this.unsubscribeFromExposureChanges();
        });
    }

    ngOnDestroy() {
        this.unsubscribeFromExposureChanges();
    }

    private subscribeToExposureChanges() {
        if (this.exposureChangeSubscription) return;

        this.exposureChangeSubscription = this.patientDataService
            .observeLastByRecordType<ExposureChange>(RecordType.ExposureChange)
            .pipe(
                tap(() => console.log("Progress container change!")),
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
        this.logger.debug("Subscribed to exposure changes");
    }

    private unsubscribeFromExposureChanges() {
        if (!this.exposureChangeSubscription) return;

        this.exposureChangeSubscription.unsubscribe();
        this.exposureChangeSubscription = undefined;
        this.logger.debug("Unsubscribed from exposure changes");
    }
}
