import { Component } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { emaiFramework } from "@geotecinit/emai-framework";

@Component({
    selector: "SymSimulationActions",
    templateUrl: "./simulation-actions.component.html",
    styleUrls: ["./simulation-actions.component.scss"],
})
export class SimulationActionsComponent {
    btnMargin = 4;

    private logger: Logger;

    constructor(private params: ModalDialogParams) {
        this.logger = getLogger("SimulationActionsComponent");
    }

    onCloseTap() {
        this.params.closeCallback();
    }

    emitEMAIFrameworkEvent(eventName: string, data?: any) {
        emaiFramework.emitEvent(eventName, data);
    }
}
