import { Component, Input } from "@angular/core";
import { Color, EventData, Font } from "@nativescript/core";
import { LineChart } from "@nativescript-community/ui-chart";
import {
    LineDataSet,
    Mode,
} from "@nativescript-community/ui-chart/data/LineDataSet";
import { LineData } from "@nativescript-community/ui-chart/data/LineData";
import { XAxisPosition } from "@nativescript-community/ui-chart/components/XAxis";
import {
    LimitLabelPosition,
    LimitLine,
} from "@nativescript-community/ui-chart/components/LimitLine";
import {
    LegendForm,
    LegendHorizontalAlignment,
} from "@nativescript-community/ui-chart/components/Legend";
import {
    AxisValueFormatter,
    AxisDateFormatter,
} from "../formatters/axis-date-formatter";
import {
    ChartData2D,
    CuttingLines,
    InternalChartData2D,
    YAxisDataRange,
} from "../common";

const CHART_BACKGROUND = "white";
const X_ANIMATION_MILLIS = 500;
const Y_ANIMATION_MILLIS = 1000;

const AXIS_LABEL_TEXT_COLOR = "#828282";
const AXIS_LINE_COLOR = "#E0E0E0";

const CUTTING_LINE_TEXT_COLOR = "#1F525E";
const CUTTING_LINE_COLOR = "#2DC38A";

const TEXT_FONT_SIZE = 12;

const COLOR_SCHEME = ["#3f2dc3", "#c3009f", "#fe006c", "#ff613a", "#ffa600"];
const LINE_COLOR_ALPHA = 0.7;

@Component({
    selector: "SymLineChart",
    templateUrl: "./line-chart.component.html",
    styleUrls: ["./line-chart.component.scss"],
})
export class LineChartComponent {
    @Input() data: Array<ChartData2D> = [];
    @Input() yAxisDataRange?: YAxisDataRange;
    @Input() cuttingLines: CuttingLines = [];

    private internalData: Array<InternalChartData2D> = [];
    private chart: LineChart;
    private xAxisFormatter?: AxisValueFormatter;
    private textFont = Font.default.withFontSize(TEXT_FONT_SIZE);
    private readonly colorScheme: Array<Color>;

    constructor() {
        this.colorScheme = COLOR_SCHEME.map((color) => {
            const nsColor = new Color(color);

            return new Color(
                Math.round(LINE_COLOR_ALPHA * 255),
                nsColor.r,
                nsColor.g,
                nsColor.b
            );
        });
    }

    onChartLoaded(event: EventData) {
        this.chart = event.object as LineChart;
        this.configureAxisDataFormatter();
        this.parseData();

        this.configureChart();
        this.configureYAxis();
        this.configureXAxis();
        this.configureLegend();
        this.addCuttingLines();

        const sets = this.generateDataSets();

        const ld = new LineData(sets);
        this.chart.setData(ld);
    }

    private configureAxisDataFormatter() {
        const data = this.data;
        if (data.length === 0) {
            return;
        }
        if (data[0].values.length === 0) {
            return;
        }
        if (data[0].values[0].x instanceof Date) {
            this.xAxisFormatter = new AxisDateFormatter(data);
        }
    }

    private parseData() {
        if (this.xAxisFormatter) {
            this.internalData = this.xAxisFormatter.getProcessedData();

            return;
        }
        this.internalData = this.data as Array<InternalChartData2D>;
    }

    private configureChart() {
        this.chart.backgroundColor = CHART_BACKGROUND;
        this.chart.setDrawGridBackground(false);

        this.chart.animateXY(X_ANIMATION_MILLIS, Y_ANIMATION_MILLIS);

        // disable dual axis (only use LEFT axis)
        this.chart.getAxisRight().setEnabled(false);
    }

    private configureYAxis() {
        const yAxis = this.chart.getAxisLeft();
        yAxis.setDrawGridLines(false);
        yAxis.setDrawAxisLine(false);
        yAxis.setFont(this.textFont);
        yAxis.setTextColor(AXIS_LABEL_TEXT_COLOR);
        if (this.yAxisDataRange) {
            const range = this.yAxisDataRange;
            yAxis.setAxisMinValue(range.min - 1);
            yAxis.setAxisMaxValue(range.max + 1);
        }
    }

    private configureXAxis() {
        const xAxis = this.chart.getXAxis();
        xAxis.setPosition(XAxisPosition.BOTTOM);
        xAxis.setDrawGridLines(false);
        xAxis.setAxisLineColor(AXIS_LINE_COLOR);
        xAxis.setFont(this.textFont);
        xAxis.setTextColor(AXIS_LABEL_TEXT_COLOR);
        if (this.xAxisFormatter) {
            xAxis.setValueFormatter(this.xAxisFormatter);
        }
    }

    private configureLegend() {
        if (this.internalData.length === 1) return;

        const legend = this.chart.getLegend();
        legend.setEnabled(true);
        legend.setFont(this.textFont);
        legend.setTextColor(AXIS_LABEL_TEXT_COLOR);
        legend.setForm(LegendForm.LINE);
        legend.setHorizontalAlignment(LegendHorizontalAlignment.RIGHT);
        legend.setWordWrapEnabled(true);
    }

    private addCuttingLines() {
        if (this.cuttingLines.length === 0) return;

        const yAxis = this.chart.getAxisLeft();
        yAxis.setDrawLimitLinesBehindData(false);

        for (const line of this.cuttingLines) {
            const limitLine = new LimitLine(line.value, line.label);
            limitLine.setLabelPosition(LimitLabelPosition.LEFT_TOP);
            limitLine.setLineColor(CUTTING_LINE_COLOR);
            limitLine.setFont(this.textFont);
            limitLine.setTextColor(CUTTING_LINE_TEXT_COLOR);
            yAxis.addLimitLine(limitLine);
        }
    }

    private generateDataSets(): Array<LineDataSet> {
        const sets = [];

        for (let i = 0; i < this.internalData.length; i++) {
            const dataset = this.internalData[i];
            const set = this.generateDataSet(i, dataset);
            sets.push(set);
        }

        return sets;
    }

    private generateDataSet(index: number, dataSet: ChartData2D): LineDataSet {
        const set = new LineDataSet(dataSet.values, dataSet.label, "x", "y");
        set.setColor(this.colorScheme[index]);
        set.setLineWidth(3);
        set.setMode(Mode.CUBIC_BEZIER);

        return set;
    }
}
