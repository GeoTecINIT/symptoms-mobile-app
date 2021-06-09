import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { NavigationService } from "~/app/views/navigation.service";
import { PatientDataService } from "~/app/views/patient-data.service";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

import { Record } from "@geotecinit/emai-framework/entities";
import { RecordType } from "~/app/core/record-type";
import { Change } from "@geotecinit/emai-framework/internal/providers";
import { emaiFramework } from "@geotecinit/emai-framework";
import { createFakeDataGenerator, DataGenerator } from "./data";
import { getConfig } from "~/app/core/config";

@Component({
    selector: "SymIdleProgress",
    templateUrl: "./idle-progress.component.html",
    styleUrls: ["./idle-progress.component.scss"],
})
export class IdleProgressComponent implements OnInit, OnDestroy {
    development: boolean;

    latestData: Record;
    hasLatestData: boolean;

    summaryData: Record;
    hasSummaryData: boolean;

    private latestDataSubscription: Subscription;
    private summaryDataSubscription: Subscription;
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

    ngOnInit() {
        this.latestDataSubscription = this.patientDataService
            .observeLastByRecordType(RecordType.ExposureChange, [
                { property: "change", comparison: "=", value: Change.END },
                { property: "successful", comparison: "=", value: true },
            ])
            .subscribe((record) => {
                this.ngZone.run(() => {
                    this.latestData = record;
                    this.hasLatestData = !!record;
                });
            });
        this.summaryDataSubscription = this.patientDataService
            .observeLastByRecordType(RecordType.ExposureAggregate)
            .subscribe((summary) => {
                this.ngZone.run(() => {
                    this.summaryData = summary;
                    this.hasSummaryData = !!summary;
                });
            });
    }

    ngOnDestroy() {
        this.latestDataSubscription?.unsubscribe();
        this.summaryDataSubscription?.unsubscribe();
    }

    onGenerateDataTap() {
        const exposureChange = this.generateData();
        if (exposureChange) {
            emaiFramework.emitEvent("exposureFinished", exposureChange);
        }
    }

    onSeeRecordsTap() {
        this.navigate("../records-list");
    }

    onSeeAggregatesTap() {
        this.navigate("../aggregate-list");
    }

    private navigate(route: string) {
        this.navigationService.navigate([route], this.activeRoute);
    }
}
