import { Component, HostListener, NgZone } from "@angular/core";
import { Subject } from "rxjs";

import {
    NotificationsReaderService,
    NotificationViewModel,
} from "../../notifications-reader.service";
import { NotificationsHandlerService } from "~/app/views/main/notifications-handler.service";

import { getLogger, Logger } from "~/app/core/utils/logger";
import {
    MainViewService,
    NavigationTab,
} from "~/app/views/main/main-view.service";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "SymNotificationsList",
    templateUrl: "./notifications-list.component.html",
    styleUrls: ["./notifications-list.component.scss"],
})
export class NotificationsListComponent {
    notifications: Array<NotificationViewModel>;

    private unloaded$ = new Subject<void>();

    private logger: Logger;

    constructor(
        private notificationsReaderService: NotificationsReaderService,
        private notificationsHandlerService: NotificationsHandlerService,
        private mainViewService: MainViewService,
        private ngZone: NgZone
    ) {
        this.logger = getLogger("NotificationsListComponent");
    }

    @HostListener("loaded")
    onLoaded() {
        this.subscribeToNotificationUpdates();
    }

    @HostListener("unloaded")
    onUnloaded() {
        this.unloaded$.next();
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
        this.notificationsReaderService.notifications$
            .pipe(takeUntil(this.unloaded$))
            .subscribe((notifications) => {
                this.ngZone.run(() => {
                    this.notifications = notifications;
                });
            });
    }
}
