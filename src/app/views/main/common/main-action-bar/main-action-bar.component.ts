import { Component, Input } from "@angular/core";

import { SettingsModalService } from "../../modals/settings/settings-modal.service";
import { SimulationModalService } from "../../modals/simulation/simulation-modal.service";
import { getConfig } from "~/app/core/config";
import { AdvancedSetting, AdvancedSettingsService } from "~/app/core/account";
import { PanicButtonModalService } from "~/app/views/main/modals/panic-button/panic-button-modal.service";
import { preparePlugin, handleWatchToUse } from "~/app/core/framework";
import { DialogsService } from "~/app/views/common/dialogs.service";
import {
    infoOnPermissionsNeed,
    infoOnWatchPermissionsNeed,
} from "~/app/core/dialogs/info";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { areWatchFeaturesEnabled } from "@awarns/wear-os/internal/setup";
import { awarns } from "@awarns/core";
import { PlainMessage } from "@awarns/wear-os";

@Component({
    selector: "SymMainActionBar",
    templateUrl: "./main-action-bar.component.html",
    styleUrls: ["./main-action-bar.component.scss"],
})
export class MainActionBarComponent {
    @Input() title: string;
    // TODO: make this an @Input property
    hasOngoingExposure: boolean;
    development: boolean;
    hasWatchConnected: boolean;
    private logger: Logger;

    panicButtonActive: boolean;

    constructor(
        private settingsModalService: SettingsModalService,
        private simulationModalService: SimulationModalService,
        private advancedSettingsService: AdvancedSettingsService,
        private panicButtonModalService: PanicButtonModalService,
        private dialogsService: DialogsService
    ) {
        this.logger = getLogger("MainActionBarComponent");
        this.development = !getConfig().production;
        this.panicButtonActive = this.advancedSettingsService.getBoolean(
            AdvancedSetting.PanicButton
        );
        this.hasWatchConnected = areWatchFeaturesEnabled();
    }

    onSimulationTap() {
        this.simulationModalService.show();
    }

    // TODO: consider tapping the button mid-exposure --> either do nothing or hide it
    // recursive version
    onHandleWatchTap() {
        handleWatchToUse()
            .then(() =>
                preparePlugin()
                    .then((ready) => {
                        if (!ready) {
                            this.informAboutWatchPermissionsNeed().then(() => {
                                this.onHandleWatchTap();
                            });
                        }
                        this.hasWatchConnected = areWatchFeaturesEnabled();
                        // TODO: fix this
                        // it sends "Permissions granted" even if they are not granted
                        if (this.hasWatchConnected) {
                            awarns.emitEvent("sendWatchConnectedMessage", {
                                plainMessage: {
                                    message: "Permissions granted",
                                },
                            });
                        } else {
                            awarns.emitEvent("sendWatchNotConnectedMessage", {
                                plainMessage: {
                                    message: "Permissions denied",
                                },
                            });
                        }
                    })
                    .catch((e) => {
                        this.logger.error(
                            `Could not prepare EMA/I framework tasks. Reason: ${e}`
                        );
                    })
            )
            .catch((e) =>
                this.logger.error(`Could not setup watch. Reason: ${e}`)
            );
    }

    //
    // onHandleWatchTap() {
    //     handleWatchToUse()
    //         .then(() => preparePlugin())
    //         .then((ready) => {
    //             if (ready) {
    //                 this.hasWatchConnected = areWatchFeaturesEnabled();
    //             } else {
    //                 this.informAboutWatchPermissionsNeed().then(() => {});
    //             }
    //         })
    //         .catch((e) => {
    //             this.logger.error(
    //                 `Error preparing or setting up watch. Reason: ${e}`
    //             );
    //         });
    // }

    onSettingsTap() {
        this.settingsModalService.show();
    }

    onHelpTap() {
        this.panicButtonModalService.show();
    }

    private informAboutWatchPermissionsNeed(): Promise<void> {
        return this.dialogsService.showInfo(infoOnWatchPermissionsNeed);
    }
}
