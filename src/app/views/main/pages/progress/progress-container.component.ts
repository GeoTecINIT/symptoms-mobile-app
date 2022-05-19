import { Component, HostListener, NgZone } from "@angular/core";
import { Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";

import { ExposureChange } from "~/app/tasks/exposure";
import { AppRecordType } from "~/app/core/app-record-type";
import { Change } from "@awarns/core/entities";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { recordsStore } from "@awarns/persistence";

@Component({
    selector: "SymProgressContainer",
    templateUrl: "./progress-container.component.html",
    styleUrls: ["./progress-container.component.scss"],
})
export class ProgressContainerComponent {
    idle: boolean;

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
                map(
                    (exposureChange: ExposureChange) =>
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
