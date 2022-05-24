import { Component } from "@angular/core";
import { NavigationService } from "../../../navigation.service";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { awarns } from "@awarns/core";

@Component({
    selector: "SymSimulationModal",
    templateUrl: "./simulation-modal.component.html",
    styleUrls: ["./simulation-modal.component.scss"],
})
export class SimulationModalComponent {
    btnMargin = 4;

    private logger: Logger;

    constructor(private navigationService: NavigationService) {
        this.logger = getLogger("SimulationModalComponent");
    }

    onCloseTap() {
        this.navigationService.goBack();
    }

    emitAwarnsFrameworkEvent(eventName: string, data?: any) {
        awarns.emitEvent(eventName, data);
    }
}
