import { Component, HostListener, NgZone } from "@angular/core";
import { NavigationService } from "~/app/views/navigation.service";
import { PatientDataService } from "~/app/views/patient-data.service";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";

import { Record } from "@geotecinit/emai-framework/entities";
import { RecordType } from "~/app/core/record-type";
import { Change } from "@geotecinit/emai-framework/internal/providers";
import { emaiFramework } from "@geotecinit/emai-framework";
import { createFakeDataGenerator, DataGenerator } from "./data";
import { getConfig } from "~/app/core/config";
import { takeUntil } from "rxjs/operators";

const GENERATE_DATA_TIMEOUT = 2000;

@Component({
    selector: "SymIdleProgress",
    templateUrl: "./idle-progress.component.html",
    styleUrls: ["./idle-progress.component.scss"],
})
export class IdleProgressComponent {
    development: boolean;

    latestData: Record;
    hasLatestData = false;

    summaryData: Record;
    hasSummaryData = false;

    generatingData = false;

    private unloaded$ = new Subject<void>();
    private readonly generateData: DataGenerator;

    constructor(
        private patientDataService: PatientDataService,
        private navigationService: NavigationService,
        private activeRoute: ActivatedRoute,
        private ngZone: NgZone
    ) {
        this.development = !getConfig().production;
        if (this.development) {
            this.generateData = createFakeDataGenerator();
        }
    }

    @HostListener("loaded")
    onLoaded() {
        this.subscribeToLatestData();
        this.subscribeToSummaryData();
    }

    @HostListener("unloaded")
    onUnloaded() {
        this.unloaded$.next();
    }

    onGenerateDataTap() {
        const exposureChange = this.generateData();
        if (exposureChange) {
            emaiFramework.emitEvent("exposureFinished", exposureChange);
        }
        this.generatingData = true;
        setTimeout(() => (this.generatingData = false), GENERATE_DATA_TIMEOUT);
    }

    onSeeAggregatesTap() {
        this.navigate("../aggregate-list");
    }

    private subscribeToLatestData() {
        this.patientDataService
            .observeLastByRecordType(RecordType.ExposureChange, [
                { property: "change", comparison: "=", value: Change.END },
                { property: "successful", comparison: "=", value: true },
            ])
            .pipe(takeUntil(this.unloaded$))
            .subscribe((record) => {
                this.ngZone.run(() => {
                    this.latestData = record;
                    this.hasLatestData = !!record;
                });
            });
    }

    private subscribeToSummaryData() {
        this.patientDataService
            .observeLastByRecordType(RecordType.ExposureAggregate)
            .pipe(takeUntil(this.unloaded$))
            .subscribe((summary) => {
                this.ngZone.run(() => {
                    this.summaryData = summary;
                    this.hasSummaryData = !!summary;
                });
            });
    }

    private navigate(route: string) {
        this.navigationService.navigate([route], this.activeRoute);
    }
}
