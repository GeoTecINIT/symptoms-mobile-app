import { Component, OnInit } from "@angular/core";
import {
    AGGREGATE_DATA,
    CUTTING_LINES,
    fakeUpdates,
    Y_AXIS_DATA_RANGE,
} from "../common";

@Component({
    selector: "SymAggregateList",
    templateUrl: "./aggregate-list.component.html",
    styleUrls: ["./aggregate-list.component.scss"],
})
export class AggregateListComponent implements OnInit {
    data = fakeUpdates(AGGREGATE_DATA, 2000);
    yAxisDataRange = Y_AXIS_DATA_RANGE;
    cuttingLines = CUTTING_LINES;

    constructor() {
        // Initialize dependencies here
    }

    ngOnInit() {
        // Use initialized dependencies
    }
}
