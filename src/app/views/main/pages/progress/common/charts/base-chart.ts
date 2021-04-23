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

import {
    ChartData2D,
    CuttingLines,
    InternalChartData2D,
    YAxisDataRange,
} from "./common";
import {
    AxisDateFormatter,
    AxisValueFormatter,
} from "./formatters/axis-date-formatter";

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

export abstract class BaseChart<
    S extends IBarLineScatterCandleBubbleDataSet<Entry>,
    D extends BarLineScatterCandleBubbleData<Entry, S>
> {
    protected readonly colorScheme: Array<Color>;
    protected chart: BarLineChartBase<Entry, S, D>;
    protected internalData: Array<InternalChartData2D> = [];
    private xAxisFormatter?: AxisValueFormatter;
    private textFont = Font.default.withFontSize(TEXT_FONT_SIZE);

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

    init(
        chart: BarLineChartBase<Entry, S, D>,
        data: Array<ChartData2D>,
        cuttingLines: CuttingLines,
        yAxisDataRange?: YAxisDataRange
    ) {
        this.chart = chart;
        this.configureAxisDataFormatter(data);
        this.parseData(data);

        this.configureChart();
        this.configureYAxis(yAxisDataRange);
        this.configureXAxis();
        this.configureLegend();
        this.addCuttingLines(cuttingLines);

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

    private configureYAxis(range?: YAxisDataRange) {
        const yAxis = this.chart.getAxisLeft();
        yAxis.setDrawGridLines(false);
        yAxis.setDrawAxisLine(false);
        yAxis.setFont(this.textFont);
        yAxis.setTextColor(AXIS_LABEL_TEXT_COLOR);
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

    private addCuttingLines(cuttingLines: CuttingLines) {
        if (cuttingLines.length === 0) return;

        const yAxis = this.chart.getAxisLeft();
        yAxis.setDrawLimitLinesBehindData(false);

        for (const line of cuttingLines) {
            const limitLine = new LimitLine(line.value, line.label);
            limitLine.setLabelPosition(LimitLabelPosition.LEFT_TOP);
            limitLine.setLineColor(CUTTING_LINE_COLOR);
            limitLine.setFont(this.textFont);
            limitLine.setTextColor(CUTTING_LINE_TEXT_COLOR);
            yAxis.addLimitLine(limitLine);
        }
    }

    protected abstract generateChartData(): D;
}
