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
import { appEvents } from "~/app/core/app-events";
import { Application } from "@nativescript/core";

const APP_EVENTS_KEY = "IdleProgressComponent";

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

    private latestDataSub: Subscription;
    private summaryDataSub: Subscription;

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
        this.subscribeAll();
        appEvents.on(Application.resumeEvent, APP_EVENTS_KEY, () => {
            this.subscribeAll();
        });
        appEvents.on(Application.suspendEvent, APP_EVENTS_KEY, () => {
            this.unsubscribeAll();
        });
    }

    ngOnDestroy() {
        this.unsubscribeAll();
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

    private subscribeAll() {
        this.subscribeToLatestData();
        this.subscribeToSummaryData();
    }

    private unsubscribeAll() {
        this.unsubscribeFromLatestData();
        this.unsubscribeFromSummaryData();
    }

    private subscribeToLatestData() {
        if (this.latestDataSub) return;

        this.latestDataSub = this.patientDataService
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
    }

    private unsubscribeFromLatestData() {
        if (!this.latestDataSub) return;
        this.latestDataSub.unsubscribe();
        this.latestDataSub = undefined;
    }

    private subscribeToSummaryData() {
        if (this.summaryDataSub) return;

        this.summaryDataSub = this.patientDataService
            .observeLastByRecordType(RecordType.ExposureAggregate)
            .subscribe((summary) => {
                this.ngZone.run(() => {
                    this.summaryData = summary;
                    this.hasSummaryData = !!summary;
                });
            });
    }

    private unsubscribeFromSummaryData() {
        if (!this.summaryDataSub) return;
        this.summaryDataSub.unsubscribe();
        this.summaryDataSub = undefined;
    }

    private navigate(route: string) {
        this.navigationService.navigate([route], this.activeRoute);
    }
}
