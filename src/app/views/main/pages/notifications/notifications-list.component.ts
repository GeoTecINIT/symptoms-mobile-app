import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import {
    NotificationsReaderService,
    NotificationViewModel,
} from "../../notifications-reader.service";
import { NotificationsHandlerService } from "~/app/views/main/notifications-handler.service";

import { getLogger, Logger } from "~/app/core/utils/logger";

@Component({
    selector: "SymNotificationsList",
    templateUrl: "./notifications-list.component.html",
    styleUrls: ["./notifications-list.component.scss"],
})
export class NotificationsListComponent implements OnInit, OnDestroy {
    notifications: Array<NotificationViewModel>;

    private notificationsSub?: Subscription;

    private logger: Logger;

    constructor(
        private notificationsReaderService: NotificationsReaderService,
        private notificationsHandlerService: NotificationsHandlerService,
        private ngZone: NgZone
    ) {
        this.logger = getLogger("NotificationsListComponent");
    }

    ngOnInit() {
        this.notificationsSub = this.notificationsReaderService.notifications$.subscribe(
            (notifications) => {
                this.ngZone.run(() => {
                    this.notifications = notifications;
                });
            }
        );
    }

    ngOnDestroy() {
        this.notificationsSub?.unsubscribe();
    }

    onListItemTap(args: any) {
        const notificationVM = this.notifications[args.index];

        return this.notificationsHandlerService
            .handle(notificationVM.notification)
            .catch((e) => {
                this.logger.error(
                    `Could not handle notification tap. Reason: ${e}`
                );
            });
    }
}
