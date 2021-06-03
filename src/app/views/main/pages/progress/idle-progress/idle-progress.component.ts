import { Component } from "@angular/core";
import { NavigationService } from "~/app/views/navigation.service";
import { PatientDataService } from "~/app/views/patient-data.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";

import { Record } from "@geotecinit/emai-framework/entities";
import { RecordType } from "~/app/core/record-type";
import { Change } from "@geotecinit/emai-framework/internal/providers";
import { share } from "rxjs/operators";
import { map } from "rxjs/internal/operators";

@Component({
    selector: "SymIdleProgress",
    templateUrl: "./idle-progress.component.html",
    styleUrls: ["./idle-progress.component.scss"],
})
export class IdleProgressComponent {
    latestData$: Observable<Record>;
    hasLatestData$: Observable<boolean>;
    summaryData$: Observable<Record>;
    hasSummaryData$: Observable<boolean>;

    constructor(
        private navigationService: NavigationService,
        private patientDataService: PatientDataService,
        private activeRoute: ActivatedRoute
    ) {
        this.latestData$ = this.patientDataService
            .observeLastByRecordType(RecordType.ExposureChange, [
                { property: "change", comparison: "=", value: Change.END },
                { property: "successful", comparison: "=", value: true },
            ])
            .pipe(share());
        this.hasLatestData$ = this.latestData$.pipe(map((record) => !!record));

        this.summaryData$ = this.patientDataService
            .observeLastByRecordType(RecordType.ExposureAggregate)
            .pipe(share());
        this.hasSummaryData$ = this.summaryData$.pipe(
            map((summary) => !!summary)
        );
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
