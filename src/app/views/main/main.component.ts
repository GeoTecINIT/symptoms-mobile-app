import { Component, OnInit, ViewContainerRef } from "@angular/core";

import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";

import { Page } from "tns-core-modules/ui/page/page";

import { MainViewService } from "./main-view.service";

import {
    BottomNavigationBar,
    TabSelectedEventData,
} from "nativescript-material-bottomnavigationbar";

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
export class MainComponent implements OnInit {
    navigationTabs = navigationTabs;
    selectedTab = navigationTabs.Progress;

    constructor(
        private routerExtension: RouterExtensions,
        private activeRoute: ActivatedRoute,
        page: Page,
        mainViewService: MainViewService,
        vcRef: ViewContainerRef
    ) {
        page.actionBarHidden = true;
        mainViewService.setViewContainerRef(vcRef);
    }

    ngOnInit() {
        this.routerExtension
            .navigate(
                [
                    {
                        outlets: {
                            progressTab: ["progress"],
                            contentTab: ["content"],
                            simulationTab: ["simulation"],
                        },
                    },
                ],
                { relativeTo: this.activeRoute }
            )
            .catch((e) => console.error("On MainComponent navigation:", e));
    }

    onNavigationBarLoaded(args: any) {
        const navigationBar: BottomNavigationBar = args.object;
        // Set here a badge if needed
    }

    onTabSelected(args: TabSelectedEventData) {
        this.selectedTab = args.newIndex;
    }
}
