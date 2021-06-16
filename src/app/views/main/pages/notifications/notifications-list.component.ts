import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { appEvents } from "~/app/core/app-events";
import { Application } from "@nativescript/core";

import {
    NotificationsReaderService,
    NotificationViewModel,
} from "../../notifications-reader.service";
import { NotificationsHandlerService } from "~/app/views/main/notifications-handler.service";

import { getLogger, Logger } from "~/app/core/utils/logger";

const APP_EVENTS_KEY = "NotificationsList";

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
        this.subscribeToNotificationUpdates();
        appEvents.on(Application.resumeEvent, APP_EVENTS_KEY, () => {
            this.subscribeToNotificationUpdates();
        });

        appEvents.on(Application.suspendEvent, APP_EVENTS_KEY, () => {
            this.unsubscribeFromNotificationUpdates();
        });
    }

    ngOnDestroy() {
        this.unsubscribeFromNotificationUpdates();
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

    private subscribeToNotificationUpdates() {
        if (this.notificationsSub) return;

        this.notificationsSub = this.notificationsReaderService.notifications$.subscribe(
            (notifications) => {
                this.ngZone.run(() => {
                    this.notifications = notifications;
                });
            }
        );
        this.logger.debug("Subscribed to notifications updates");
    }

    private unsubscribeFromNotificationUpdates() {
        if (!this.notificationsSub) return;

        this.notificationsSub.unsubscribe();
        this.notificationsSub = undefined;
        this.logger.debug("Unsubscribed from notifications updates");
    }
}
