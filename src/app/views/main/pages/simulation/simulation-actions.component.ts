import { Component, OnInit } from "@angular/core";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { emaiFramework } from "@geotecinit/emai-framework";

@Component({
    selector: "SymSimulationActions",
    templateUrl: "./simulation-actions.component.html",
    styleUrls: ["./simulation-actions.component.scss"],
})
export class SimulationActionsComponent implements OnInit {
    btnMargin = 4;

    private logger: Logger;

    constructor() {
        this.logger = getLogger("SimulationActionsComponent");
    }

    ngOnInit() {
        // Use initialized dependencies
    }

    emitEMAIFrameworkEvent(eventName: string) {
        emaiFramework.emitEvent(eventName);
    }
}
