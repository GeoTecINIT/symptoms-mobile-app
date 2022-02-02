import { Component } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { DialogsService } from "~/app/views/common/dialogs.service";
import { AppSettingsService } from "~/app/views/app-settings.service";
import { NavigationService } from "~/app/views/navigation.service";
import { ActivatedRoute } from "@angular/router";
import { getLogger, Logger } from "~/app/core/utils/logger";
import {
    confirmWantsToExport,
    confirmWantsToUnlink,
} from "~/app/core/dialogs/confirm";

const TAPS_TO_ENTER_ADVANCED_SETTINGS = 5;

@Component({
    selector: "SymSettingsContainer",
    templateUrl: "./settings-container.component.html",
    styleUrls: ["./settings-container.component.scss"],
})
export class SettingsContainerComponent {
    get version(): string {
        return this.appSettingsService.version;
    }

    private logger: Logger;
    private versionTapCount = 0;

    constructor(
        private params: ModalDialogParams,
        private dialogsService: DialogsService,
        private appSettingsService: AppSettingsService,
        private navigationService: NavigationService,
        private activeRoute: ActivatedRoute
    ) {
        this.logger = getLogger("SettingsContainerComponent");
    }

    onClose() {
        this.params.closeCallback();
    }

    onUnlinkTap() {
        this.dialogsService
            .askConfirmationWithDestructiveAction(confirmWantsToUnlink)
            .then((unlink) => {
                if (unlink) {
                    this.appSettingsService
                        .unlink()
                        .then(() => this.onClose())
                        .catch((e) =>
                            this.logger.error(`Could not unlink. Reason: ${e}`)
                        );
                }
            });
    }

    onExportTap() {
        this.dialogsService
            .askConfirmation(confirmWantsToExport)
            .then((wantsToExport) => {
                if (wantsToExport) {
                    this.appSettingsService
                        .exportData()
                        .then((path) =>
                            this.logger.debug(
                                `Data exported and available at: ${path}`
                            )
                        )
                        .catch((e) =>
                            this.logger.error(
                                `Could not export data. Reason: ${e}`
                            )
                        );
                }
            });
    }

    onVersionTap() {
        if (this.versionTapCount < TAPS_TO_ENTER_ADVANCED_SETTINGS - 1) {
            this.versionTapCount++;

            return;
        }
        this.navigationService.navigate(["./advanced"], this.activeRoute);
    }
}
