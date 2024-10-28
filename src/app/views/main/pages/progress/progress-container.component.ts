import { Component, HostListener, NgZone } from "@angular/core";
import { Subject } from "rxjs";
import { filter, map, takeUntil, tap } from "rxjs/operators";

import { ExposureChange } from "~/app/tasks/exposure";
import { AppRecordType } from "~/app/core/app-record-type";
import { Change } from "@awarns/core/entities";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { recordsStore } from "@awarns/persistence";

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
    // Make the enum accessible in the template
    public ProgressStatus = ProgressStatus;
    
    progressStatus: ProgressStatus = ProgressStatus.IDLE;
    previousProgressStatus: ProgressStatus = null;

    private unloaded$ = new Subject<void>();

    private logger: Logger;

    constructor(private ngZone: NgZone) {
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
        recordsStore
            .listLast(AppRecordType.ExposureChange)
            .pipe(
                takeUntil(this.unloaded$),
                map((exposureChange: ExposureChange) => {
                    console.log('exposureChange 👉👉👉', exposureChange);
                    console.log('this.progressStatus 👉👉👉', this.progressStatus);
                    console.log('this.previousProgressStatus 👉👉👉', this.previousProgressStatus);

                    if (!exposureChange) return ProgressStatus.IDLE;
                    if (exposureChange.change === Change.START) return ProgressStatus.IN_PROGRESS;
                    if (exposureChange.change === Change.END && this.progressStatus === ProgressStatus.IN_PROGRESS) {
                        return ProgressStatus.AWAITING_POST_EXPOSURE_QUESTIONS;
                    }
                    // if (this.progressStatus !== ProgressStatus.IDLE) return ProgressStatus.IN_PROGRESS;
                }),
                tap((status: ProgressStatus) => {
                    if (status === ProgressStatus.AWAITING_POST_EXPOSURE_QUESTIONS) {
                        setTimeout(() => {
                            this.ngZone.run(() => {
                                this.previousProgressStatus = this.progressStatus;
                                this.progressStatus = ProgressStatus.IDLE;
                            });
                        }, 60 * 1000);
                    }
                })
            )
            .subscribe((status: ProgressStatus) => {
                this.ngZone.run(() => {
                    this.previousProgressStatus = this.progressStatus;
                    this.progressStatus = status;

                    console.log('this.progressStatus 👉👉👉', this.progressStatus);
                    console.log('this.previousProgressStatus 👉👉👉', this.previousProgressStatus);
                });
            });
    }
}
