import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { InAppBrowserService } from "~/app/views/common/in-app-browser.service";
import { NavigationService } from "~/app/views/navigation.service";
import { AppSettingsService } from "~/app/views/app-settings.service";
import { DialogsService } from "~/app/views/common/dialogs.service";

import { preparePlugin } from "~/app/core/framework";
import { emitTreatmentStartEvent } from "~/app/core/framework/events";

import { infoOnPermissionsNeed } from "~/app/core/dialogs/info";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { autoStarter } from "nativescript-autostarter";

@Component({
    selector: "SymTutorial",
    templateUrl: "./tutorial.component.html",
    styleUrls: ["./tutorial.component.scss"],
})
export class TutorialComponent implements OnInit {
    private logger: Logger;

    constructor(
        private inAppBrowserService: InAppBrowserService,
        private navigationService: NavigationService,
        private appSettingsService: AppSettingsService,
        private dialogsService: DialogsService,
        private activeRoute: ActivatedRoute
    ) {
        this.logger = getLogger("TutorialComponent");
    }

    ngOnInit() {
        this.appSettingsService.reloadPatientInfo().catch((e) => {
            this.logger.error(
                `Could not load patient information. Reason: ${e}`
            );
        });
    }

    onOpenProjectWebsiteTap() {
        this.inAppBrowserService.openProjectWebSite();
    }

    onOpenPrivacyPolicyTap() {
        this.inAppBrowserService.openPrivacyPolicy();
    }

    async onConfigureTap() {
        const done = await preparePlugin();
        if (!done) {
            this.dialogsService.showInfo(infoOnPermissionsNeed);
            return;
        }

        emitTreatmentStartEvent();
        this.appSettingsService.markSetupAsComplete();
        this.navigationService.navigate(["../setup-confirmation"], {
            source: this.activeRoute,
            clearHistory: true,
        });
    }

    async launchAutostarterIfNeeded() {
        const autoStarterManager = autoStarter.getManager();
        const available = autoStarterManager.canShowAutoStartDialogRequest();
        // this.logger.info(`Can show dialog request: ${available}`);

        if (available) {
            const dialogResponse =
                await autoStarterManager.showAutoStartDialogRequest();
            // this.logger.info(`Dialog response: ${dialogResponse}`);
        }
    }

    async proceedWithSetup() {
        const setupComplete = await preparePlugin();
        if (setupComplete) {
            emitTreatmentStartEvent();
            this.appSettingsService.markSetupAsComplete();
            this.navigationService.navigate(["../setup-confirmation"], {
                source: this.activeRoute,
                clearHistory: true,
            });
        } else {
            this.dialogsService.showInfo(infoOnPermissionsNeed);
        }
    }
}
