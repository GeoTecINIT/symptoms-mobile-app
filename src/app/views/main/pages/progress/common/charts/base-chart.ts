import { Entry } from "@nativescript-community/ui-chart/data/Entry";
import { IBarLineScatterCandleBubbleDataSet } from "@nativescript-community/ui-chart/interfaces/datasets/IBarLineScatterCandleBubbleDataSet";
import { BarLineScatterCandleBubbleData } from "@nativescript-community/ui-chart/data/BarLineScatterCandleBubbleData";
import { BarLineChartBase } from "@nativescript-community/ui-chart/charts/BarLineChartBase";
import { XAxisPosition } from "@nativescript-community/ui-chart/components/XAxis";
import {
    LegendForm,
    LegendHorizontalAlignment,
} from "@nativescript-community/ui-chart/components/Legend";
import {
    LimitLabelPosition,
    LimitLine,
} from "@nativescript-community/ui-chart/components/LimitLine";

import { Color, Font } from "@nativescript/core";
import { ReplaySubject, Subscription } from "rxjs";

import {
    ChartData2D,
    CuttingLines,
    InternalChartData2D,
    YAxisDataRange,
} from "./common";
import { AxisDateFormatter, AxisValueFormatter } from "./formatters";

const CHART_BACKGROUND = "white";
const X_ANIMATION_MILLIS = 500;
const Y_ANIMATION_MILLIS = 1000;

const AXIS_LABEL_TEXT_COLOR = "#828282";
const AXIS_LINE_COLOR = "#E0E0E0";

const CUTTING_LINE_TEXT_COLOR = "#1F525E";
const CUTTING_LINE_COLOR = "#62868e";
const CUTTING_LINE_WIDTH = 1;

const TEXT_FONT_SIZE = 12;

const COLOR_SCHEME = [
    "#2DC38A",
    "#F9CB5E",
    "#669C81",
    "#B1AF50",
    "#79979E",
    "#AEBEB2",
];

const DATASET_COLOR_ALPHA = 0.7;

export abstract class BaseChart<
    S extends IBarLineScatterCandleBubbleDataSet<Entry>,
    D extends BarLineScatterCandleBubbleData<Entry, S>
> {
    cuttingLines: CuttingLines;
    yAxisDataRange?: YAxisDataRange;

    protected chart: BarLineChartBase<Entry, S, D>;
    protected dataStream$ = new ReplaySubject<Array<ChartData2D>>(1);
    protected readonly colorScheme: Array<Color>;
    protected internalData: Array<InternalChartData2D> = [];

    private xAxisFormatter?: AxisValueFormatter;
    private textFont = Font.default.withFontSize(TEXT_FONT_SIZE);
    private streamSubscription: Subscription;

    constructor() {
        this.colorScheme = COLOR_SCHEME.map((color) => {
            const nsColor = new Color(color);

            return new Color(
                Math.round(DATASET_COLOR_ALPHA * 255),
                nsColor.r,
                nsColor.g,
                nsColor.b
            );
        });
    }

    load(chart: BarLineChartBase<Entry, S, D>) {
        this.chart = chart;
        this.streamSubscription = this.dataStream$.subscribe((data) => {
            if (data.length === 0 || data[0].values.length === 0) return;
            this.plot(data);
        });
    }

    unload() {
        if (this.streamSubscription) {
            this.streamSubscription.unsubscribe();
        }
    }

    private plot(data: Array<ChartData2D>) {
        this.chart.clear();
        this.configureAxisDataFormatter(data);
        this.parseData(data);

        this.configureChart();
        this.configureYAxis();
        this.configureXAxis();
        this.configureLegend();
        this.addCuttingLines();

        const chartData = this.generateChartData();
        this.chart.setData(chartData);
    }

    private configureAxisDataFormatter(data: Array<ChartData2D>) {
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

    private parseData(data: Array<ChartData2D>) {
        if (this.xAxisFormatter) {
            this.internalData = this.xAxisFormatter.getProcessedData();

            return;
        }
        this.internalData = data as Array<InternalChartData2D>;
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
        const range = this.yAxisDataRange;
        if (range) {
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

        yAxis.removeAllLimitLines();
        for (const line of this.cuttingLines) {
            const limitLine = new LimitLine(line.value, line.label);
            limitLine.setLabelPosition(LimitLabelPosition.LEFT_TOP);
            limitLine.setLineColor(CUTTING_LINE_COLOR);
            limitLine.setFont(this.textFont);
            limitLine.setTextColor(CUTTING_LINE_TEXT_COLOR);
            limitLine.setLineWidth(CUTTING_LINE_WIDTH);
            yAxis.addLimitLine(limitLine);
        }
    }

    protected abstract generateChartData(): D;
}
