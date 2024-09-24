import { Component, Input } from "@angular/core";

import { SettingsModalService } from "../../modals/settings/settings-modal.service";
import { SimulationModalService } from "../../modals/simulation/simulation-modal.service";
import { getConfig } from "~/app/core/config";
import { AdvancedSetting, AdvancedSettingsService } from "~/app/core/account";
import { PanicButtonModalService } from "~/app/views/main/modals/panic-button/panic-button-modal.service";
import {
    preparePlugin,
    handleWatchToUse,
    isWatchConnectedInUse,
} from "~/app/core/framework";
import { DialogsService } from "~/app/views/common/dialogs.service";
import {
    infoOnPermissionsNeed,
    infoOnWatchPermissionsNeed,
} from "~/app/core/dialogs/info";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { areWatchFeaturesEnabled } from "@awarns/wear-os/internal/setup";
import { awarns } from "@awarns/core";
import { Dialogs } from "@nativescript/core";
import {
    PlainMessage,
    WatchSensorsProvider,
    getConnectedWatches,
} from "@awarns/wear-os";

@Component({
    selector: "SymMainActionBar",
    templateUrl: "./main-action-bar.component.html",
    styleUrls: ["./main-action-bar.component.scss"],
})
export class MainActionBarComponent {
    @Input() title: string;
    development: boolean;
    hasOngoingExposure: boolean;
    hasWatchAvailable: boolean;
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

    ngOnInit(): void {
        this.checkWatchAvailability();
    }

    private async checkWatchAvailability(): Promise<void> {
        const watches = await getConnectedWatches();
        this.hasWatchAvailable = watches.length > 0;
    }

    onSimulationTap() {
        this.simulationModalService.show();
    }

    onWatchDialogTap() {
        if (!this.hasWatchConnected) {
            Dialogs.confirm({
                title: "Conectar reloj",
                message: "¿Permitir la recogida de datos desde el reloj?",
                okButtonText: "Sí",
                cancelButtonText: "No",
            })
                .then((result) => {
                    if (result) {
                        this.logger.info(
                            "hasWatchConnected: " + this.hasWatchConnected
                        );
                        this.onHandleWatchTap();
                    }
                })
                .catch((error) => {
                    this.logger.error(
                        "Error al mostrar el diálogo de confirmación " + error
                    );
                });
        } else {
            Dialogs.confirm({
                title: "Desconectar reloj",
                message: "¿Denegar la recogida de datos desde el reloj?",
                okButtonText: "Sí",
                cancelButtonText: "No",
            })
                .then((result) => {
                    if (result) {
                        this.logger.info(
                            "hasWatchConnected: " + this.hasWatchConnected
                        );
                        this.onHandleWatchTap();
                    }
                })
                .catch((error) => {
                    this.logger.error(
                        "Error al mostrar el diálogo de confirmación " + error
                    );
                });
        }
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

    // async onHandleWatchTap() {
    //     try {
    //         await handleWatchToUse();
    //         const ready = await preparePlugin();
    //         if (!ready) {
    //             await this.informAboutWatchPermissionsNeed();
    //             return this.onHandleWatchTap(); // Solo volver a intentar si es necesario
    //         }
    //         this.hasWatchConnected = areWatchFeaturesEnabled();
    //         if (this.hasWatchConnected) {
    //             awarns.emitEvent("sendWatchConnectedMessage", {
    //                 plainMessage: {
    //                     message: "Permissions granted",
    //                 },
    //             });
    //         } else {
    //             awarns.emitEvent("sendWatchNotConnectedMessage", {
    //                 plainMessage: {
    //                     message: "Permissions denied",
    //                 },
    //             });
    //         }
    //     } catch (error) {
    //         this.logger.error(`Could not setup watch. Reason: ${error}`);
    //     }
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
