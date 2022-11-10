import { Component, HostListener, NgZone } from "@angular/core";
import { NavigationService } from "~/app/views/navigation.service";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";

import { MainViewService } from "~/app/views/main/main-view.service";

import { Record, Change } from "@awarns/core/entities";
import { recordsStore } from "@awarns/persistence";
import { AppRecordType } from "~/app/core/app-record-type";
import { awarns } from "@awarns/core";
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

    private unloaded$ = new Subject<void>();
    private readonly generateData: DataGenerator;

    constructor(
        private mainViewService: MainViewService,
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
            awarns.emitEvent("exposureFinished", exposureChange);
        }
        this.mainViewService.showActivityIndicator();
        setTimeout(
            () => this.mainViewService.hideActivityIndicator(),
            GENERATE_DATA_TIMEOUT
        );
    }

    onSeeAggregatesTap() {
        this.navigate("/main/progress-detail/aggregate-list");
    }

    private subscribeToLatestData() {
        recordsStore
            .listLast(AppRecordType.ExposureChange, [
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
        recordsStore
            .listLast(AppRecordType.ExposureAggregate)
            .pipe(takeUntil(this.unloaded$))
            .subscribe((summary) => {
                this.ngZone.run(() => {
                    this.summaryData = summary;
                    this.hasSummaryData = !!summary;
                });
            });
    }

    private navigate(route: string) {
        this.navigationService.navigate([route]);
    }
}
