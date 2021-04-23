import { Component, Input } from "@angular/core";
import { EventData } from "@nativescript/core";

import { BaseChart } from "../base-chart";
import { LineChart } from "@nativescript-community/ui-chart";
import {
    LineDataSet,
    Mode,
} from "@nativescript-community/ui-chart/data/LineDataSet";
import { LineData } from "@nativescript-community/ui-chart/data/LineData";

import { ChartData2D, CuttingLines, YAxisDataRange } from "../common";

@Component({
    selector: "SymLineChart",
    templateUrl: "./line-chart.component.html",
    styleUrls: ["./line-chart.component.scss"],
})
export class LineChartComponent extends BaseChart<LineDataSet, LineData> {
    @Input() data: Array<ChartData2D> = [];
    @Input() yAxisDataRange?: YAxisDataRange;
    @Input() cuttingLines: CuttingLines = [];

    onChartLoaded(event: EventData) {
        const chart = event.object as LineChart;
        this.init(chart, this.data, this.cuttingLines, this.yAxisDataRange);
    }

    protected generateChartData(): LineData {
        const sets = [];

        for (let i = 0; i < this.internalData.length; i++) {
            const dataset = this.internalData[i];
            const set = this.generateDataSet(i, dataset);
            sets.push(set);
        }

        return new LineData(sets);
    }

    private generateDataSet(index: number, dataSet: ChartData2D): LineDataSet {
        const set = new LineDataSet(dataSet.values, dataSet.label, "x", "y");
        set.setColor(this.colorScheme[index]);
        set.setLineWidth(3);
        set.setMode(Mode.CUBIC_BEZIER);

        return set;
    }
}
