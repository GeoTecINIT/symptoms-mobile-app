import { Component, OnDestroy, OnInit, ViewContainerRef } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { Application, Page } from "@nativescript/core";

import { getLogger, Logger } from "~/app/core/utils/logger";
import { AuthService } from "../auth.service";
import { DialogsService } from "~/app/views/common/dialogs.service";
import { ConfirmModalService } from "~/app/views/main/modals/confirm";
import { QuestionsModalService } from "~/app/views/main/modals/questions";
import { FeedbackModalService } from "~/app/views/main/modals/feedback";
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
import { ContentViewModalService } from "~/app/views/main/modals/content-view/content-view-modal.service";
import { setupAreasOfInterest } from "~/app/core/framework/aois";

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
export class MainComponent implements OnInit, OnDestroy {
    navigationTabs = navigationTabs;
    selectedTab = navigationTabs.Progress;

    private loggedInSub?: Subscription;
    private notificationsSub?: Subscription;
    private logger: Logger;

    constructor(
        private authService: AuthService,
        private dialogsService: DialogsService,
        private confirmModalService: ConfirmModalService,
        private questionsModalService: QuestionsModalService,
        private feedbackModalService: FeedbackModalService,
        private contentViewModalService: ContentViewModalService,
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
        this.controlAppLoginStatus();
        this.checkEMAIFrameworkStatus();
        appEvents.once(Application.displayedEvent, () => {
            this.notificationsHandlerService.init(
                this.confirmModalService,
                this.feedbackModalService,
                this.questionsModalService,
                this.contentViewModalService
            );
        });
    }

    ngOnDestroy() {
        this.loggedInSub?.unsubscribe();
    }

    onNavigationBarLoaded(args: any) {
        const navigationBar: BottomNavigationBar = args.object;
        navigationBar.selectTab(this.selectedTab);
        this.notificationsSub = this.notificationsReaderService.unread$.subscribe(
            (unread) => {
                if (
                    !unread ||
                    this.selectedTab === navigationTabs.Notifications
                ) {
                    return;
                }
                navigationBar.showBadge(navigationTabs.Notifications);
            }
        );
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
        this.loggedInSub = this.authService.loggedIn$.subscribe((loggedIn) => {
            if (!loggedIn) {
                this.navigationService.forceNavigate(["/welcome"]);
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
