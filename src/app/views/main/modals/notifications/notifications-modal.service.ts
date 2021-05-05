import { Injectable } from "@angular/core";

import { NotificationsModule } from "./notifications.module";

import { MainViewService } from "../../main-view.service";

import { NotificationsModalComponent } from "./notifications-modal.component";
import { getLogger, Logger } from "~/app/core/utils/logger";

@Injectable({
    providedIn: NotificationsModule,
})
export class NotificationsModalService {
    private logger: Logger;

    constructor(private mainViewService: MainViewService) {
        this.logger = getLogger("NotificationsModalService");
    }

    show() {
        this.mainViewService
            .showFullScreenAnimatedModal(NotificationsModalComponent)
            .catch((e) =>
                this.logger.error(
                    `Could not show notifications modal. Reason: ${e}`
                )
            );
    }
}
