import { Injectable } from "@angular/core";

import { MainViewService } from "../../main-view.service";

import { ContentViewModalComponent } from "./content-view-modal.component";

import { getLogger, Logger } from "~/app/core/utils/logger";
import { emitPatientReadContentAcquiredEvent } from "~/app/core/framework/events";
import { UserReadContent } from "@awarns/notifications";

@Injectable({
    providedIn: "root",
})
export class ContentViewModalService {
    private logger: Logger;

    constructor(private mainViewService: MainViewService) {
        this.logger = getLogger("ContentViewModalService");
    }

    showContent(id: string, notificationId?: number): Promise<void> {
        return this.mainViewService
            .showFullScreenAnimatedModal(ContentViewModalComponent, { id })
            .then((seenDuringSession) => {
                emitPatientReadContentAcquiredEvent(
                    new UserReadContent(id, seenDuringSession, notificationId)
                );
            })
            .catch((e) =>
                this.logger.error(
                    `Could not show content view modal. Reason: ${e}`
                )
            );
    }
}
