import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { InAppBrowserService } from "~/app/views/common/in-app-browser.service";
import { NavigationService } from "~/app/views/navigation.service";
import { AppSettingsService } from "~/app/views/app-settings.service";
import { DialogsService } from "~/app/views/common/dialogs.service";

import { preparePlugin } from "~/app/core/framework";
import { emitTreatmentStartEvent } from "~/app/core/framework/events";

import { infoOnPermissionsNeed } from "~/app/core/dialogs/info";

@Component({
    selector: "SymTutorial",
    templateUrl: "./tutorial.component.html",
    styleUrls: ["./tutorial.component.scss"],
})
export class TutorialComponent implements OnInit {
    constructor(
        private inAppBrowserService: InAppBrowserService,
        private navigationService: NavigationService,
        private appSettingsService: AppSettingsService,
        private dialogsService: DialogsService,
        private activeRoute: ActivatedRoute
    ) {
        // Initialize dependencies here
    }

    ngOnInit() {
        // Use initialized dependencies
    }

    onOpenPrivacyPolicyTap() {
        this.inAppBrowserService.openPrivacyPolicy();
    }

    onConfigureTap() {
        preparePlugin().then((done) => {
            if (done) {
                emitTreatmentStartEvent();
                this.appSettingsService.markSetupAsComplete();
                this.navigationService.navigate(
                    ["../setup-confirmation"],
                    this.activeRoute,
                    true
                );
            } else {
                this.dialogsService.showInfo(infoOnPermissionsNeed);
            }
        });
    }
}
