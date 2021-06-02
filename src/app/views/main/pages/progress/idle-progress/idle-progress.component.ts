import { Component, Input } from "@angular/core";
import { NavigationService } from "~/app/views/navigation.service";
import { PatientDataService } from "~/app/views/patient-data.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";

import { Record } from "@geotecinit/emai-framework/entities";
import { RecordType } from "~/app/core/record-type";
import { Change } from "@geotecinit/emai-framework/internal/providers";

import {
    Y_AXIS_DATA_RANGE,
    CUTTING_LINES,
    AGGREGATE_DATA,
} from "../pages/common";
import { ChartData2D } from "../common/charts";

@Component({
    selector: "SymIdleProgress",
    templateUrl: "./idle-progress.component.html",
    styleUrls: ["./idle-progress.component.scss"],
})
export class IdleProgressComponent {
    @Input()
    set hasData(hasData: boolean) {
        this._hasData = hasData;
        if (hasData) {
            this.summaryData = AGGREGATE_DATA;
        } else {
            this.summaryData = undefined;
        }
    }
    get hasData(): boolean {
        return this._hasData;
    }

    latestData$: Observable<Record>;
    summaryData: Array<ChartData2D>;
    yAxisDataRange = Y_AXIS_DATA_RANGE;
    cuttingLines = CUTTING_LINES;

    private _hasData = false;

    constructor(
        private navigationService: NavigationService,
        private patientDataService: PatientDataService,
        private activeRoute: ActivatedRoute
    ) {
        this.latestData$ = this.patientDataService.observeLastByRecordType(
            RecordType.ExposureChange,
            [
                { property: "change", comparison: "=", value: Change.END },
                { property: "successful", comparison: "=", value: true },
            ]
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
