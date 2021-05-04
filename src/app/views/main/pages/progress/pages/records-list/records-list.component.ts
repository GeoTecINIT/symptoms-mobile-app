import { Component, OnInit } from "@angular/core";
import { FAKE_RECORDS_LIST } from "./data";

@Component({
    selector: "SymRecordsList",
    templateUrl: "./records-list.component.html",
    styleUrls: ["./records-list.component.scss"],
})
export class RecordsListComponent implements OnInit {
    data = FAKE_RECORDS_LIST;

    constructor() {
        // Initialize dependencies here
    }

    ngOnInit() {
        // Use initialized dependencies
    }
}
