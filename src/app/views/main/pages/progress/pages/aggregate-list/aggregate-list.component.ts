import { Component, OnInit } from "@angular/core";
import { FAKE_AGGREGATES_LIST } from "./data";

@Component({
    selector: "SymAggregateList",
    templateUrl: "./aggregate-list.component.html",
    styleUrls: ["./aggregate-list.component.scss"],
})
export class AggregateListComponent implements OnInit {
    data = FAKE_AGGREGATES_LIST;

    constructor() {
        // Initialize dependencies here
    }

    ngOnInit() {
        // Use initialized dependencies
    }
}
