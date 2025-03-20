import { Component, Input } from "@angular/core";
import { Record } from "@awarns/core/entities";
import { ChartDescription } from "~/app/core/charts/chart-description";
import { transformIntoChartDescription } from "~/app/core/charts/data-transformer";

export type ChartType = "line" | "bar";

@Component({
    selector: "SymChartCard",
    templateUrl: "./chart-card.component.html",
    styleUrls: ["./chart-card.component.scss"],
})
export class ChartCardComponent {
    private _record: Record;
    private _showPlaceName: boolean = false; // Default to false, adjust as needed

    @Input() set record(value: Record) {
        this._record = value;
        this.updateChartDescription();
    }

    @Input() set showPlaceName(value: boolean) {
        this._showPlaceName = value;
        this.updateChartDescription();
    }

    @Input() chartType: ChartType;

    chartDescription: ChartDescription;

    private updateChartDescription() {
        if (this._record && this._showPlaceName !== undefined) {
            this.chartDescription = transformIntoChartDescription(
                this._record,
                this._showPlaceName
            );
        }
    }

    get hasEnoughData(): boolean {
        if (!this.chartDescription?.chart) return false;
        const data = this.chartDescription.chart.data;
        if (!data || data.length === 0) return false;

        if (this.chartType === "line") {
            return data.some((dataset) => dataset?.values?.length >= 2);
        } else if (this.chartType === "bar") {
            return data.some((dataset) => dataset?.values?.length >= 1);
        }

        return true;
    }
}
