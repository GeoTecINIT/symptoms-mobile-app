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
        private dialogsService: DialogsService,
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
                console.error(
                    "Could not prepare EMA/I framework tasks. Reason:",
                    e
                );
            });
    }

    private informAboutPermissionsNeed(): Promise<void> {
        return this.dialogsService.showInfo(
            "La aplicación no puede funcionar sin estos permisos",
            "De acuerdo",
            "Los permisos que te hemos solicitado son necesarios para que la aplicación funcione, sin ellos no podrás utilizar esta aplicación durante el tratamiento. Si tienes dudas, revisa nuestra política de privacidad o consulta a tu terapeuta."
        );
    }
}
