import { Component, OnInit } from "@angular/core";
import { ProgressViewService } from "./progress-view.service";

@Component({
    selector: "SymProgressContainer",
    templateUrl: "./progress-container.component.html",
    styleUrls: ["./progress-container.component.scss"],
})
export class ProgressContainerComponent implements OnInit {
    get idle(): boolean {
        return this.progressViewService.idle;
    }
    hasData = false;

    constructor(private progressViewService: ProgressViewService) {
        // Initialize dependencies here
    }

    ngOnInit() {
        // Use initialized dependencies
    }

    switchExposureState() {
        this.progressViewService.switchIdleState();
    }

    switchDataAvailabilityState() {
        this.hasData = !this.hasData;
    }
}
