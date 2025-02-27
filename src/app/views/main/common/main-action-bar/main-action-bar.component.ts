import { Component, Input } from "@angular/core";

import { SettingsModalService } from "../../modals/settings/settings-modal.service";
import { SimulationModalService } from "../../modals/simulation/simulation-modal.service";
import { getConfig } from "~/app/core/config";
import {
    AccountService,
    AdvancedSetting,
    AdvancedSettingsService,
} from "~/app/core/account";
import { PanicButtonModalService } from "~/app/views/main/modals/panic-button/panic-button-modal.service";
import { preparePlugin, handleWatchToUse } from "~/app/core/framework";
import { DialogsService } from "~/app/views/common/dialogs.service";
import {
    infoOnPermissionsNeed,
    infoOnWatchPermissionsNeed,
} from "~/app/core/dialogs/info";
import { getLogger, Logger } from "~/app/core/utils/logger";
import {
    areWatchFeaturesEnabled,
    setWatchFeaturesState,
    useWatch,
} from "@awarns/wear-os/internal/setup";
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
    hasWatchAvailable: boolean; // whether the mobile app detects the watch app
    hasWatchConnected: boolean; // whether permissions have been granted on the watch
    testUser = this.accountService.deviceProfile.patientId;
    private logger: Logger;

    panicButtonActive: boolean;

    constructor(
        private settingsModalService: SettingsModalService,
        private simulationModalService: SimulationModalService,
        private advancedSettingsService: AdvancedSettingsService,
        private panicButtonModalService: PanicButtonModalService,
        private dialogsService: DialogsService,
        private watchDisplayService: WatchDisplayService,
        private accountService: AccountService
    ) {
        this.logger = getLogger("MainActionBarComponent");
        this.development = !getConfig().production;
        this.panicButtonActive = this.advancedSettingsService.getBoolean(
            AdvancedSetting.PanicButton
        );
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
                .then(async (result) => {
                    if (result) {
                        await this.handleWatchConnect();
                    }
                })
                .catch((error) => {
                    this.logger.error(
                        "Error al mostrar el diálogo de confirmación: " + error
                    );
                });
        } else {
            Dialogs.confirm({
                title: "Desconectar reloj",
                message: "¿Denegar la recogida de datos desde el reloj?",
                okButtonText: "Sí",
                cancelButtonText: "No",
            })
                .then(async (result) => {
                    if (result) {
                        await this.handleWatchDisconnect();
                    }
                })
                .catch((error) => {
                    this.logger.error(
                        "Error al mostrar el diálogo de confirmación: " + error
                    );
                });
        }
    }

    async handleWatchConnect() {
        const logger = getLogger("WatchSetup");

        const watches = await getConnectedWatches();
        if (!watches.length) {
            logger.info("No watch is connected (physically paired)");
            this.hasWatchConnected = false;
            return;
        }

        setWatchFeaturesState(true);

        const watch = watches[0];
        useWatch(watch);

        const isReady = await preparePlugin();
        if (!isReady) {
            console.log("Watch plugin is not ready");
            this.hasWatchConnected = false;
            await this.informAboutWatchPermissionsNeed();
            return;
        }
        this.hasWatchConnected = true;

        awarns.emitEvent("sendWatchConnectedMessage", {
            plainMessage: {
                message: "Permissions granted",
            },
        });
    }

    async handleWatchDisconnect() {
        setWatchFeaturesState(false);
        this.hasWatchConnected = false;
        awarns.emitEvent("sendWatchNotConnectedMessage", {
            plainMessage: {
                message: "Permissions denied",
            },
        });
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
