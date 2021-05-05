import { Component, OnDestroy, OnInit, ViewContainerRef } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { Page } from "@nativescript/core";

import { AuthService } from "../auth.service";
import { NavigationService } from "../navigation.service";

import { MainViewService } from "./main-view.service";

import {
    BottomNavigationBar,
    TabSelectedEventData,
} from "@nativescript-community/ui-material-bottomnavigationbar";
import { preparePlugin } from "~/app/core/utils/emai-framework";
import { DialogsService } from "~/app/views/common/dialogs.service";
import { Logger, getLogger } from "~/app/core/utils/logger";
import { infoOnPermissionsNeed } from "~/app/core/dialogs/info";

const navigationTabs = {
    Progress: 0,
    Content: 1,
    Simulation: 2,
};

@Component({
    selector: "SymMain",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit, OnDestroy {
    navigationTabs = navigationTabs;
    selectedTab = navigationTabs.Progress;

    private loggedInSub: Subscription;
    private logger: Logger;

    constructor(
        private authService: AuthService,
        private navigationService: NavigationService,
        private dialogsService: DialogsService,
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
    }

    ngOnDestroy() {
        if (this.loggedInSub) {
            this.loggedInSub.unsubscribe();
        }
    }

    onNavigationBarLoaded(args: any) {
        const navigationBar: BottomNavigationBar = args.object;
        navigationBar.selectTab(this.selectedTab);
        // Set here a badge if needed
    }

    onTabSelected(args: TabSelectedEventData) {
        this.selectedTab = args.newIndex;
    }

    private loadTabOutlets() {
        this.navigationService.outletNavigation(
            {
                progressTab: ["progress"],
                contentTab: ["content"],
                simulationTab: ["simulation"],
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
