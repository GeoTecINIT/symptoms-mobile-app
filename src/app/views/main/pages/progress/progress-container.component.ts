import { Component, OnInit } from "@angular/core";

@Component({
    selector: "SymProgressContainer",
    templateUrl: "./progress-container.component.html",
    styleUrls: ["./progress-container.component.scss"],
})
export class ProgressContainerComponent implements OnInit {
    idle = true;
    hasData = false;

    constructor() {
        // Initialize dependencies here
    }

    ngOnInit() {
        // Use initialized dependencies
    }

    switchExposureState() {
        this.idle = !this.idle;
    }

    switchDataAvailabilityState() {
        this.hasData = !this.hasData;
    }
}
