import { Component, Input, OnDestroy } from "@angular/core";
import { EventData } from "@nativescript/core";

import { BaseChart } from "../base-chart";

import { BarChart } from "@nativescript-community/ui-chart";
import { BarDataSet } from "@nativescript-community/ui-chart/data/BarDataSet";
import { BarData } from "@nativescript-community/ui-chart/data/BarData";

import { ChartData2D, CuttingLines, YAxisDataRange } from "../common";

@Component({
    selector: "SymBarChart",
    templateUrl: "./bar-chart.component.html",
    styleUrls: ["./bar-chart.component.scss"],
})
export class BarChartComponent
    extends BaseChart<BarDataSet, BarData>
    implements OnDestroy {
    @Input()
    set data(data: Array<ChartData2D>) {
        this.dataStream$.next(data);
    }
    @Input() cuttingLines: CuttingLines = [];
    @Input() yAxisDataRange?: YAxisDataRange;

    onChartLoaded(event: EventData) {
        const chart = event.object as BarChart;
        this.load(chart);
    }

    ngOnDestroy() {
        this.unload();
    }

    protected generateChartData(): BarData {
        const sets = [];

        for (let i = 0; i < this.internalData.length; i++) {
            const dataset = this.internalData[i];
            const set = this.generateDataSet(i, dataset);
            sets.push(set);
        }

        return new BarData(sets);
    }

    private generateDataSet(index: number, dataSet: ChartData2D): BarDataSet {
        const set = new BarDataSet(dataSet.values, dataSet.label, "x", "y");
        set.setColor(this.colorScheme[index]);

        return set;
    }
}
