import { Component } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { Observable } from "rxjs";

import {
    NotificationsReaderService,
    NotificationViewModel,
} from "../../../notifications-reader.service";
import { NotificationsHandlerService } from "~/app/views/main/notifications-handler.service";

import { take } from "rxjs/operators";
import { getLogger, Logger } from "~/app/core/utils/logger";

@Component({
    selector: "SymNotificationsList",
    templateUrl: "./notifications-list.component.html",
    styleUrls: ["./notifications-list.component.scss"],
})
export class NotificationsListComponent {
    get notifications$(): Observable<Array<NotificationViewModel>> {
        return this.notificationsReaderService.notifications$;
    }

    private logger: Logger;

    constructor(
        private params: ModalDialogParams,
        private notificationsReaderService: NotificationsReaderService,
        private notificationsHandlerService: NotificationsHandlerService
    ) {
        this.logger = getLogger("NotificationsListComponent");
    }

    onClose() {
        this.params.closeCallback();
    }

    onListItemTap(args: any) {
        this.fetchNotificationByIndex(args.index)
            .then((notificationVM) => {
                return this.notificationsHandlerService.handle(
                    notificationVM.notification
                );
            })
            .catch((e) => {
                this.logger.error(
                    `Could not handle notification tap. Reason: ${e}`
                );
            });
    }

    private async fetchNotificationByIndex(
        index: number
    ): Promise<NotificationViewModel> {
        const notifications = await this.notifications$
            .pipe(take(1))
            .toPromise();

        return notifications[index];
    }
}
