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

import { MainViewService, NavigationTab } from "./main-view.service";

import {
    BottomNavigationBar,
    TabSelectedEventData,
} from "@nativescript-community/ui-material-bottomnavigationbar";

import { infoOnPermissionsNeed } from "~/app/core/dialogs/info";
import { preparePlugin } from "~/app/core/framework";
import { appEvents } from "~/app/core/app-events";
import { setupAreasOfInterest } from "~/app/core/framework/aois";
import { takeUntil } from "rxjs/operators";

const APP_EVENTS_KEY = "MainComponent";

@Component({
    selector: "SymMain",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
    NavigationTab = NavigationTab;

    get selectedTab(): NavigationTab {
        return this.mainViewService.selectedTab;
    }

    private navigationBar: BottomNavigationBar;
    private navigationBarDestroyed$ = new Subject<void>();

    private unloaded$ = new Subject();

    private logger: Logger;

    constructor(
        private mainViewService: MainViewService,
        private authService: AuthService,
        private dialogsService: DialogsService,
        private notificationsHandlerService: NotificationsHandlerService,
        private notificationsReaderService: NotificationsReaderService,
        private navigationService: NavigationService,
        private activeRoute: ActivatedRoute,
        page: Page,
        vcRef: ViewContainerRef
    ) {
        this.logger = getLogger("MainComponent");
        page.actionBarHidden = true;
        mainViewService.setViewContainerRef(vcRef);
        mainViewService.onTabSelected((tab) =>
            this.updateNavigationBarTab(tab)
        );
    }

    ngOnInit() {
        this.loadTabOutlets();
        this.checkEMAIFrameworkStatus();

        appEvents.on(Application.resumeEvent, APP_EVENTS_KEY, () => {
            this.logger.debug("Notification handler initialized");
            this.notificationsHandlerService.resume();
        });
        appEvents.on(Application.suspendEvent, APP_EVENTS_KEY, () => {
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
        this.updateNavigationBarTab(this.selectedTab);
        this.subscribeToPendingNotifications();
    }

    onNavigationBarUnloaded() {
        this.navigationBarDestroyed$.next();
    }

    onTabSelected(args: TabSelectedEventData) {
        this.mainViewService.setSelectedTab(args.newIndex);
    }

    private updateNavigationBarTab(tab: NavigationTab) {
        if (!this.navigationBar) return;
        this.navigationBar.selectTab(tab);
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
                    this.selectedTab === NavigationTab.Notifications
                ) {
                    navigationBar.removeBadge(NavigationTab.Notifications);
                } else {
                    navigationBar.showBadge(NavigationTab.Notifications);
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
