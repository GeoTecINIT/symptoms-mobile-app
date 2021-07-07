import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";

import { PatientDataService } from "~/app/views/patient-data.service";
import { ExposureChange } from "~/app/tasks/exposure";
import { RecordType } from "~/app/core/record-type";
import { Change } from "@geotecinit/emai-framework/entities";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { appEvents } from "~/app/core/app-events";
import { Application } from "@nativescript/core";

const APP_EVENTS_KEY = "SymProgressContainer";

@Component({
    selector: "SymProgressContainer",
    templateUrl: "./progress-container.component.html",
    styleUrls: ["./progress-container.component.scss"],
})
export class ProgressContainerComponent implements OnInit, OnDestroy {
    idle: boolean;

    private exposureChangesSub: Subscription;

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
        appEvents.on(Application.suspendEvent, APP_EVENTS_KEY, () => {
            this.unsubscribeFromExposureChanges();
        });
    }

    ngOnDestroy() {
        this.unsubscribeFromExposureChanges();
    }

    private subscribeToExposureChanges() {
        if (this.exposureChangesSub) return;

        this.exposureChangesSub = this.patientDataService
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
                });
            });
    }

    private unsubscribeFromExposureChanges() {
        if (!this.exposureChangesSub) return;
        this.exposureChangesSub.unsubscribe();
        this.exposureChangesSub = undefined;
    }
}
