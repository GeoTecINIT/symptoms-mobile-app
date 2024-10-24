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
import { Dialogs } from "@nativescript/core";
import {
    PlainMessage,
    WatchSensorsProvider,
    getConnectedWatches,
} from "@awarns/wear-os";
import { WatchDisplayService } from "~/app/views/main/common/main-action-bar/watch-display.service";

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
        private dialogsService: DialogsService,
        private watchDisplayService: WatchDisplayService
    ) {
        this.logger = getLogger("MainActionBarComponent");
        this.development = !getConfig().production;
        this.panicButtonActive = this.advancedSettingsService.getBoolean(
            AdvancedSetting.PanicButton
        );
        // this.hasWatchConnected = areWatchFeaturesEnabled();
    }

    ngOnInit(): void {
        this.checkWatchAvailability();
        this.watchDisplayService.watchConnected$.subscribe((connected) => {
            this.hasWatchAvailable = connected;
        });
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
                        this.onHandleWatchTap();
                    } else {
                        this.hasWatchConnected = false;
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
                        this.hasWatchConnected = false;
                        this.logger.info(
                            "👉👉👉 onWatchDialogTap Desconectar hasWatchConnected: " +
                                this.hasWatchConnected
                        );
                    } else {
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
    async onHandleWatchTap() {
        try {
            await handleWatchToUse();
            const isReady = await preparePlugin();

            if (isReady !== true) {
                console.log(
                    "👉👉👉 onHandleWatchTap notReady hasWatchConnected",
                    this.hasWatchConnected
                );
                this.hasWatchConnected = false;
                await this.informAboutWatchPermissionsNeed();
                this.onHandleWatchTap();
                awarns.emitEvent("sendWatchNotConnectedMessage", {
                    plainMessage: {
                        message: "Permissions denied",
                    },
                });
                return;
            }
            console.log("👉👉👉 READY", isReady);
            this.hasWatchConnected = true;
            console.log(
                "👉👉👉 onHandleWatchTap isReady hasWatchConnected",
                this.hasWatchConnected
            );
            awarns.emitEvent("sendWatchConnectedMessage", {
                plainMessage: {
                    message: "Permissions granted",
                },
            });
        } catch (e) {
            this.logger.error(`Could not setup watch. Reason: ${e}`);
        }
    }

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
