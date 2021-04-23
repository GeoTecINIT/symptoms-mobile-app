import { Component, OnInit } from "@angular/core";
import { ChartData2D, CuttingLines, YAxisDataRange } from "./common/charts";

const TEST_DATA: Array<ChartData2D> = [
    {
        label: "Nivel de ansiedad",
        values: [
            { x: new Date(2021, 3, 23, 13, 35), y: 2 },
            { x: new Date(2021, 3, 23, 13, 40), y: 2 },
            { x: new Date(2021, 3, 23, 13, 45), y: 4 },
            { x: new Date(2021, 3, 23, 13, 50), y: 7 },
            { x: new Date(2021, 3, 23, 13, 55), y: 8 },
            { x: new Date(2021, 3, 23, 14, 0), y: 7 },
            { x: new Date(2021, 3, 23, 14, 5), y: 6 },
            { x: new Date(2021, 3, 23, 14, 10), y: 5 },
            { x: new Date(2021, 3, 23, 14, 15), y: 6 },
            { x: new Date(2021, 3, 23, 14, 20), y: 5 },
            { x: new Date(2021, 3, 23, 14, 25), y: 5 },
            { x: new Date(2021, 3, 23, 14, 30), y: 3 },
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
