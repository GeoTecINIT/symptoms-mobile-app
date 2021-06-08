import { Injectable } from "@angular/core";

import { SimulationModule } from "./simulation.module";

import { MainViewService } from "../../main-view.service";

import { SimulationModalComponent } from "./simulation-modal.component";
import { getLogger, Logger } from "~/app/core/utils/logger";

@Injectable({
    providedIn: SimulationModule,
})
export class SimulationModalService {
    private logger: Logger;

    constructor(private mainViewService: MainViewService) {
        this.logger = getLogger("SimulationModalService");
    }

    show() {
        this.mainViewService
            .showFullScreenAnimatedModal(SimulationModalComponent)
            .catch((e) =>
                this.logger.error(
                    `Could not show simulation modal. Reason: ${e}`
                )
            );
    }
}
