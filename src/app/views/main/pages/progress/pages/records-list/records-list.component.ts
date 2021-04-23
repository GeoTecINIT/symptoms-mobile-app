import { Component, OnInit } from "@angular/core";
import { CUTTING_LINES, SESSION_DATA, Y_AXIS_DATA_RANGE } from "../common";

@Component({
    selector: "SymRecordsList",
    templateUrl: "./records-list.component.html",
    styleUrls: ["./records-list.component.scss"],
})
export class RecordsListComponent implements OnInit {
    data = SESSION_DATA;
    yAxisDataRange = Y_AXIS_DATA_RANGE;
    cuttingLines = CUTTING_LINES;

    constructor() {
        // Initialize dependencies here
    }

    ngOnInit() {
        // Use initialized dependencies
    }
}
