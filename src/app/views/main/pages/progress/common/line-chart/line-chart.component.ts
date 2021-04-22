import { Component } from "@angular/core";
import { EventData } from "@nativescript/core";
import { LineChart } from "@nativescript-community/ui-chart";
import {
    LineDataSet,
    Mode,
} from "@nativescript-community/ui-chart/data/LineDataSet";
import { LineData } from "@nativescript-community/ui-chart/data/LineData";
import { XAxisPosition } from "@nativescript-community/ui-chart/components/XAxis";
import { LimitLine } from "@nativescript-community/ui-chart/components/LimitLine";
import { Description } from "@nativescript-community/ui-chart/components/Description";

@Component({
    selector: "SymLineChart",
    templateUrl: "./line-chart.component.html",
    styleUrls: ["./line-chart.component.scss"],
})
export class LineChartComponent {
    onChartLoaded(event: EventData) {
        const chart = event.object as LineChart;
        chart.backgroundColor = "white";

        const desc = new Description();
        desc.setText("Test");

        // enable touch gestures
        chart.setTouchEnabled(true);

        chart.setDrawGridBackground(false);

        // enable scaling and dragging
        chart.setDragEnabled(true);
        chart.setScaleXEnabled(true);

        // force pinch zoom along both axis
        chart.setPinchZoom(false);

        chart.animateXY(500, 1000);

        // disable dual axis (only use LEFT axis)
        chart.getAxisRight().setEnabled(false);

        const yAxis = chart.getAxisLeft();
        yAxis.setAxisMinValue(-1);
        yAxis.setAxisMaxValue(11);
        yAxis.setDrawGridLines(false);
        yAxis.setDrawLimitLinesBehindData(true);

        const lowerLimit = new LimitLine(2, "Ansiedad leve");
        yAxis.addLimitLine(lowerLimit);

        const mediumLimit = new LimitLine(5, "Ansiedad moderada");
        yAxis.addLimitLine(mediumLimit);

        const upperLimit = new LimitLine(8, "Ansiedad alta");
        yAxis.addLimitLine(upperLimit);

        chart.getXAxis().setPosition(XAxisPosition.BOTTOM);
        chart.getXAxis().setDrawGridLines(false);

        const myData = new Array(12).fill(0).map((v, i) => ({
            index: i,
            value: Math.floor(Math.random() * 11),
        }));

        const sets = [];
        const set = new LineDataSet(myData, "Dataset 1", "index", "value");
        set.setMode(Mode.CUBIC_BEZIER);
        set.setCubicIntensity(0.15);
        sets.push(set);

        // Create a data object with the data sets
        const ld = new LineData(sets);

        // Set data
        chart.setData(ld);
    }
}
