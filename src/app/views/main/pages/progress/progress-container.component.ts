import { Component, HostListener, NgZone } from "@angular/core";
import { Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";

import { PatientDataService } from "~/app/views/patient-data.service";
import { ExposureChange } from "~/app/tasks/exposure";
import { AppRecordType } from "~/app/core/app-record-type";
import { Change } from "@awarns/core/entities";
import { getLogger, Logger } from "~/app/core/utils/logger";

@Component({
    selector: "SymProgressContainer",
    templateUrl: "./progress-container.component.html",
    styleUrls: ["./progress-container.component.scss"],
})
export class ProgressContainerComponent {
    idle: boolean;

    private unloaded$ = new Subject<void>();

    private logger: Logger;

    constructor(
        private patientDataService: PatientDataService,
        private ngZone: NgZone
    ) {
        this.logger = getLogger("ProgressContainer");
    }

    @HostListener("loaded")
    onLoaded() {
        this.subscribeToExposureChanges();
    }

    @HostListener("unloaded")
    onUnloaded() {
        this.unloaded$.next();
    }

    private subscribeToExposureChanges() {
        this.patientDataService
            .observeLastByRecordType<ExposureChange>(
                AppRecordType.ExposureChange
            )
            .pipe(
                takeUntil(this.unloaded$),
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
}
