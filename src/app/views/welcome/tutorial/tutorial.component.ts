import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { InAppBrowserService } from "~/app/views/common/in-app-browser.service";
import { NavigationService } from "~/app/views/navigation.service";
import { AppSettingsService } from "~/app/views/app-settings.service";
import { DialogsService } from "~/app/views/common/dialogs.service";

import { taskDispatcher } from "nativescript-task-dispatcher";

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
                this.appSettingsService.markSetupAsComplete();
                this.navigationService.navigate(
                    ["../setup-confirmation"],
                    this.activeRoute,
                    true
                );
            } else {
                this.dialogsService.showInfo(
                    "La aplicación no puede funcionar sin estos permisos",
                    "De acuerdo",
                    "Los permisos que te hemos solicitado son necesarios para que la aplicación funcione, sin ellos no podrás utilizar esta aplicación durante el tratamiento. Si tienes dudas, revisa nuestra política de privacidad o consulta a tu terapeuta."
                );
            }
        });
    }
}

async function preparePlugin(): Promise<boolean> {
    const isReady = await taskDispatcher.isReady();
    if (isReady) return true;
    try {
        await taskDispatcher.prepare();

        return true;
    } catch (e) {
        return false;
    }
}
