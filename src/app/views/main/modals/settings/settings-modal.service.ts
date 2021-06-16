import { Injectable } from "@angular/core";

import { MainViewService } from "../../main-view.service";

import { SettingsModalComponent } from "./settings-modal.component";
import { getLogger, Logger } from "~/app/core/utils/logger";

@Injectable({
    providedIn: "root",
})
export class SettingsModalService {
    private logger: Logger;

    constructor(private mainViewService: MainViewService) {
        this.logger = getLogger("SettingsModalService");
    }

    show() {
        this.mainViewService
            .showFullScreenAnimatedModal(SettingsModalComponent)
            .catch((e) =>
                this.logger.error(`Error while opening settings modal: ${e}`)
            );
    }
}
