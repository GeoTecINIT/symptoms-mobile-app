import { Injectable } from "@angular/core";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { MainViewService } from "~/app/views/main/main-view.service";
import { PanicButtonModalComponent } from "~/app/views/main/modals/panic-button/panic-button-modal.component";

@Injectable({
    providedIn: "root",
})
export class PanicButtonModalService {
    private logger: Logger;

    constructor(private mainViewService: MainViewService) {
        this.logger = getLogger("PanicButtonService");
    }

    show() {
        this.mainViewService
            .showFullScreenAnimatedModal(PanicButtonModalComponent)
            .catch((e) =>
                this.logger.error(
                    `Error while opening panic button modal: ${e}`
                )
            );
    }
}
