import { Component, HostListener, NgZone } from "@angular/core";
import { Subject } from "rxjs";
import { filter, map, takeUntil, tap } from "rxjs/operators";

import { ExposureChange } from "~/app/tasks/exposure";
import { AppRecordType } from "~/app/core/app-record-type";
import { Change } from "@awarns/core/entities";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { recordsStore } from "@awarns/persistence";

import { ProgressContainerService } from "./progress-container.service";

export enum ProgressStatus {
    IDLE = 0,
    IN_PROGRESS = 1,
    AWAITING_POST_EXPOSURE_QUESTIONS = 2,
}

@Component({
    selector: "SymProgressContainer",
    templateUrl: "./progress-container.component.html",
    styleUrls: ["./progress-container.component.scss"],
})
export class ProgressContainerComponent {
    public ProgressStatus = ProgressStatus;

    progressStatus: ProgressStatus = ProgressStatus.IDLE;
    previousProgressStatus: ProgressStatus = null;

    private unloaded$ = new Subject<void>();

    private logger: Logger;

    constructor(
        private ngZone: NgZone,
        private progressContainerService: ProgressContainerService
    ) {
        this.logger = getLogger("ProgressContainer");
    }

    @HostListener("loaded")
    onLoaded() {
        this.progressStatus = this.progressContainerService.getProgressStatus();
        this.previousProgressStatus =
            this.progressContainerService.getPreviousProgressStatus();
        this.subscribeToExposureChanges();
    }

    @HostListener("unloaded")
    onUnloaded() {
        this.progressContainerService.setProgressStatus(this.progressStatus);
        this.progressContainerService.setPreviousProgressStatus(
            this.previousProgressStatus
        );
        this.unloaded$.next();
    }

    private subscribeToExposureChanges() {
        recordsStore
            .listLast(AppRecordType.ExposureChange)
            .pipe(
                takeUntil(this.unloaded$),
                map((exposureChange: ExposureChange) => {
                    console.log("exposureChange 👉👉👉", exposureChange);
                    if (
                        !exposureChange ||
                        (exposureChange.change === Change.END &&
                            exposureChange?.successful === false)
                    )
                        return ProgressStatus.IDLE;
                    if (exposureChange.change === Change.START)
                        return ProgressStatus.IN_PROGRESS;
                    if (
                        exposureChange.change === Change.END &&
                        (this.progressStatus !== ProgressStatus.IDLE ||
                            this.previousProgressStatus === null)
                    ) {
                        return ProgressStatus.AWAITING_POST_EXPOSURE_QUESTIONS;
                    }
                }),
                tap((status: ProgressStatus) => {
                    if (
                        status ===
                        ProgressStatus.AWAITING_POST_EXPOSURE_QUESTIONS
                    ) {
                        if (
                            !this.progressContainerService.isTimerInitialized()
                        ) {
                            setTimeout(() => {
                                this.ngZone.run(() => {
                                    this.previousProgressStatus =
                                        this.progressStatus;
                                    this.progressStatus = ProgressStatus.IDLE;
                                    this.progressContainerService.setTimerInitialized(
                                        true
                                    );
                                    this.progressContainerService.setProgressStatus(
                                        this.progressStatus
                                    );
                                    this.progressContainerService.setPreviousProgressStatus(
                                        this.previousProgressStatus
                                    );
                                });
                            }, 60 * 1000);
                        }
                    } else {
                        this.progressContainerService.setTimerInitialized(
                            false
                        );
                    }
                })
            )
            .subscribe((status: ProgressStatus) => {
                this.ngZone.run(() => {
                    this.previousProgressStatus = this.progressStatus;
                    this.progressStatus = status;

                    this.progressContainerService.setProgressStatus(
                        this.progressStatus
                    );
                    this.progressContainerService.setPreviousProgressStatus(
                        this.previousProgressStatus
                    );
                });
            });
    }
}
