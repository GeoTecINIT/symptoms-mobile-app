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

    constructor(
        private authService: AuthService,
        private navigationService: NavigationService,
        private activeRoute: ActivatedRoute,
        page: Page,
        mainViewService: MainViewService,
        vcRef: ViewContainerRef
    ) {
        page.actionBarHidden = true;
        mainViewService.setViewContainerRef(vcRef);
    }

    ngOnInit() {
        this.loadTabOutlets();
        this.controlAppLoginStatus();
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
}
