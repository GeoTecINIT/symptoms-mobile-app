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
    @Input()
    set record(record: Record) {
        this.chartDescription = transformIntoChartDescription(record);
    }
    @Input() chartType: ChartType;

    chartDescription: ChartDescription;
}
