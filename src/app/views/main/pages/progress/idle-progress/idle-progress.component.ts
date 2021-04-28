import { Component, Input } from "@angular/core";
import { NavigationService } from "~/app/views/navigation.service";
import { ActivatedRoute } from "@angular/router";
import {
    SESSION_DATA,
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
            this.latestData = SESSION_DATA;
            this.summaryData = AGGREGATE_DATA;
        } else {
            this.latestData = undefined;
            this.summaryData = undefined;
        }
    }
    get hasData(): boolean {
        return this._hasData;
    }

    latestData: Array<ChartData2D>;
    summaryData: Array<ChartData2D>;
    yAxisDataRange = Y_AXIS_DATA_RANGE;
    cuttingLines = CUTTING_LINES;

    private _hasData = false;

    constructor(
        private navigationService: NavigationService,
        private activeRoute: ActivatedRoute
    ) {}

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
