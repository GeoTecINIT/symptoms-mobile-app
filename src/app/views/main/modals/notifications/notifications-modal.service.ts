import { Injectable } from "@angular/core";

import { NotificationsModule } from "./notifications.module";

import { MainViewService } from "../../main-view.service";

import { NotificationsModalComponent } from "./notifications-modal.component";

@Injectable({
    providedIn: NotificationsModule,
})
export class NotificationsModalService {
    constructor(private mainViewService: MainViewService) {}

    show() {
        this.mainViewService
            .showFullScreenAnimatedModal(NotificationsModalComponent)
            .catch((e) =>
                console.error("Could not show notifications modal:", e)
            );
    }
}
