import {
    Component,
    HostListener,
    OnInit,
    ViewContainerRef,
} from "@angular/core";
import { Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { Application, Page } from "@nativescript/core";

import { getLogger, Logger } from "~/app/core/utils/logger";
import { AuthService } from "../auth.service";
import { DialogsService } from "~/app/views/common/dialogs.service";
import { NotificationsHandlerService } from "~/app/views/main/notifications-handler.service.ts";
import { NotificationsReaderService } from "~/app/views/main/notifications-reader.service";

import { NavigationService } from "../navigation.service";

import { MainViewService } from "./main-view.service";

import {
    BottomNavigationBar,
    TabSelectedEventData,
} from "@nativescript-community/ui-material-bottomnavigationbar";

import { infoOnPermissionsNeed } from "~/app/core/dialogs/info";
import { preparePlugin } from "~/app/core/framework";
import { appEvents } from "~/app/core/app-events";
import { setupAreasOfInterest } from "~/app/core/framework/aois";
import { takeUntil } from "rxjs/internal/operators";

const navigationTabs = {
    Progress: 0,
    Content: 1,
    Notifications: 2,
};

@Component({
    selector: "SymMain",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
    navigationTabs = navigationTabs;
    selectedTab = navigationTabs.Progress;

    private navigationBar: BottomNavigationBar;
    private navigationBarDestroyed$ = new Subject<void>();

    private unloaded$ = new Subject();

    private logger: Logger;

    constructor(
        private authService: AuthService,
        private dialogsService: DialogsService,
        private notificationsHandlerService: NotificationsHandlerService,
        private notificationsReaderService: NotificationsReaderService,
        private navigationService: NavigationService,
        private activeRoute: ActivatedRoute,
        page: Page,
        mainViewService: MainViewService,
        vcRef: ViewContainerRef
    ) {
        this.logger = getLogger("MainComponent");
        page.actionBarHidden = true;
        mainViewService.setViewContainerRef(vcRef);
    }

    ngOnInit() {
        this.loadTabOutlets();
        this.checkEMAIFrameworkStatus();

        appEvents.on(Application.resumeEvent, "MainComponent", () => {
            this.logger.debug("Notification handler initialized");
            this.notificationsHandlerService.resume();
        });
        appEvents.on(Application.suspendEvent, "MainComponent", () => {
            this.logger.debug("Notification handler paused");
            this.notificationsHandlerService.pause();
        });
    }

    @HostListener("loaded")
    onLoaded() {
        this.controlAppLoginStatus();
    }

    @HostListener("unloaded")
    onUnloaded() {
        this.unloaded$.next();
    }

    onNavigationBarLoaded(args: any) {
        this.navigationBar = args.object;
        this.navigationBar.selectTab(this.selectedTab);
        this.subscribeToPendingNotifications();
    }

    onNavigationBarUnloaded() {
        this.navigationBarDestroyed$.next();
    }

    onTabSelected(args: TabSelectedEventData) {
        this.selectedTab = args.newIndex;
    }

    private loadTabOutlets() {
        this.navigationService.outletNavigation(
            {
                progressTab: ["progress"],
                contentTab: ["content"],
                notificationsTab: ["notifications"],
            },
            this.activeRoute
        );
    }

    private controlAppLoginStatus() {
        this.authService.loggedIn$
            .pipe(takeUntil(this.unloaded$))
            .subscribe((loggedIn) => {
                if (!loggedIn) {
                    this.navigationService.forceNavigate(["/welcome"]);
                }
            });
    }

    private subscribeToPendingNotifications() {
        this.notificationsReaderService.unread$
            .pipe(takeUntil(this.navigationBarDestroyed$))
            .subscribe((unread) => {
                const navigationBar = this.navigationBar;

                const nativeComponent =
                    navigationBar.android || navigationBar.ios;
                if (!nativeComponent) return;

                if (
                    !unread ||
                    this.selectedTab === navigationTabs.Notifications
                ) {
                    navigationBar.removeBadge(navigationTabs.Notifications);
                } else {
                    navigationBar.showBadge(navigationTabs.Notifications);
                }
            });
    }

    private checkEMAIFrameworkStatus() {
        preparePlugin()
            .then((ready) => {
                setupAreasOfInterest().catch((e) =>
                    this.logger.error(
                        `Could not setup areas of interest. Reason: ${e}`
                    )
                );
                if (!ready) {
                    this.informAboutPermissionsNeed().then(() => {
                        this.checkEMAIFrameworkStatus();
                    });
                }
            })
            .catch((e) => {
                this.logger.error(
                    `Could not prepare EMA/I framework tasks. Reason: ${e}`
                );
            });
    }

    private informAboutPermissionsNeed(): Promise<void> {
        return this.dialogsService.showInfo(infoOnPermissionsNeed);
    }
}
