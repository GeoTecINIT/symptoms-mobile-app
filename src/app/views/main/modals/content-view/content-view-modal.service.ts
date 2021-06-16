import { Injectable } from "@angular/core";

import { MainViewService } from "../../main-view.service";

import { ContentViewModalComponent } from "./content-view-modal.component";

import { getLogger, Logger } from "~/app/core/utils/logger";

@Injectable({
    providedIn: "root",
})
export class ContentViewModalService {
    private logger: Logger;

    constructor(private mainViewService: MainViewService) {
        this.logger = getLogger("ContentViewModalService");
    }

    showContent(id: string): Promise<void> {
        return this.mainViewService
            .showFullScreenAnimatedModal(ContentViewModalComponent, { id })
            .catch((e) =>
                this.logger.error(
                    `Could not show content view modal. Reason: ${e}`
                )
            );
    }
}
