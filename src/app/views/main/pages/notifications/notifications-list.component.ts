import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import {
    NotificationsReaderService,
    NotificationViewModel,
} from "../../notifications-reader.service";
import { NotificationsHandlerService } from "~/app/views/main/notifications-handler.service";

import { getLogger, Logger } from "~/app/core/utils/logger";
import { appEvents } from "~/app/core/app-events";
import { Application } from "@nativescript/core";
import {
    MainViewService,
    NavigationTab,
} from "~/app/views/main/main-view.service";

const APP_EVENTS_KEY = "NotificationsListComponent";

@Component({
    selector: "SymNotificationsList",
    templateUrl: "./notifications-list.component.html",
    styleUrls: ["./notifications-list.component.scss"],
})
export class NotificationsListComponent implements OnInit, OnDestroy {
    notifications: Array<NotificationViewModel>;

    private notificationUpdatesSub: Subscription;

    private logger: Logger;

    constructor(
        private notificationsReaderService: NotificationsReaderService,
        private notificationsHandlerService: NotificationsHandlerService,
        private mainViewService: MainViewService,
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

    onSeeProgressTap() {
        this.mainViewService.setSelectedTab(NavigationTab.Progress);
    }

    private subscribeToNotificationUpdates() {
        if (this.notificationUpdatesSub) return;

        this.notificationUpdatesSub = this.notificationsReaderService.notifications$.subscribe(
            (notifications) => {
                this.ngZone.run(() => {
                    this.notifications = notifications;
                });
            }
        );
    }

    private unsubscribeFromNotificationUpdates() {
        if (!this.notificationUpdatesSub) return;
        this.notificationUpdatesSub.unsubscribe();
        this.notificationUpdatesSub = undefined;
    }
}
