import { Component, OnInit } from "@angular/core";
import {
    ChartData2D,
    CuttingLines,
    YAxisDataRange,
} from "./common/charts/line-chart/line-chart.component";

const TEST_DATA: Array<ChartData2D> = [
    {
        label: "Nivel de ansiedad",
        values: [
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 2, y: 4 },
            { x: 3, y: 7 },
            { x: 4, y: 8 },
            { x: 5, y: 7 },
            { x: 6, y: 6 },
            { x: 7, y: 5 },
            { x: 8, y: 6 },
            { x: 9, y: 5 },
            { x: 10, y: 5 },
            { x: 11, y: 3 },
        ],
    },
];
const Y_AXIS_DATA_RANGE: YAxisDataRange = {
    min: 0,
    max: 10,
};

const CUTTING_LINES: CuttingLines = [
    { label: "Leve", value: 2 },
    { label: "Moderada", value: 5 },
    { label: "Alta", value: 8 },
];

@Component({
    selector: "SymProgressContainer",
    templateUrl: "./progress-container.component.html",
    styleUrls: ["./progress-container.component.scss"],
})
export class ProgressContainerComponent implements OnInit {
    testData = TEST_DATA;
    yAxisDataRange = Y_AXIS_DATA_RANGE;
    cuttingLines = CUTTING_LINES;

    idle = true;

    constructor() {
        // Initialize dependencies here
    }

    ngOnInit() {
        // Use initialized dependencies
    }

    switchExposureState() {
        this.idle = !this.idle;
    }
}
