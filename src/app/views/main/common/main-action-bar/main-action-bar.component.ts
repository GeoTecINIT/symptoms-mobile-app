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
import {
    preparePlugin,
    verifyWatchPermissionsActive,
} from "~/app/core/framework";
import { DialogsService } from "~/app/views/common/dialogs.service";
import { infoOnWatchPermissionsNeed } from "~/app/core/dialogs/info";
import { getLogger, Logger } from "~/app/core/utils/logger";
import {
    setWatchFeaturesState,
    useWatch,
} from "@awarns/wear-os/internal/setup";
import { awarns } from "@awarns/core";
import { Dialogs } from "@nativescript/core";
import { getConnectedWatches } from "@awarns/wear-os";
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

    // hasWatchAvailable is whether the mobile sees any watch physically
    // hasWatchConnected is whether permissions have actually been granted
    hasWatchAvailable: boolean;
    hasWatchConnected: boolean;

    // user for google play testers
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
        private accountService: AccountService,
    ) {
        this.logger = getLogger("MainActionBarComponent");
        this.development = !getConfig().production;

        this.panicButtonActive = this.advancedSettingsService.getBoolean(
            AdvancedSetting.PanicButton,
        );
    }

    async ngOnInit(): Promise<void> {
        const watches = await getConnectedWatches();
        this.hasWatchAvailable = watches.length > 0;
        this.watchDisplayService.setWatchAvailable(this.hasWatchAvailable);
        this.watchDisplayService.watchAvailable$.subscribe((isAvailable) => {
            this.hasWatchAvailable = isAvailable;
        });

        let actualPermissionsActive = false;
        if (watches.length > 0) {
            try {
                actualPermissionsActive = await verifyWatchPermissionsActive();
                this.logger.info(
                    `Permisos del reloj activos al iniciar: ${actualPermissionsActive}`,
                );
            } catch (error) {
                this.logger.error("Error checking watch permissions: " + error);
                actualPermissionsActive = false;
            }
        }

        this.watchDisplayService.setWatchConnected(actualPermissionsActive);
        this.watchDisplayService.watchConnected$.subscribe((connected) => {
            this.hasWatchConnected = connected;
        });
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
                        "Error al mostrar el diálogo de confirmación: " + error,
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
                        "Error al mostrar el diálogo de confirmación: " + error,
                    );
                });
        }
    }

    async handleWatchConnect() {
        const logger = getLogger("WatchSetup");

        const watches = await getConnectedWatches();
        if (!watches.length) {
            logger.info("No watch is connected (physically paired)");
            this.hasWatchAvailable = false;
            this.watchDisplayService.setWatchAvailable(false);
            return;
        }

        setWatchFeaturesState(true);

        const watch = watches[0];
        useWatch(watch);

        const isReady = await preparePlugin();
        if (!isReady) {
            console.log(
                "Watch plugin is not ready (permissions likely denied)",
            );
            this.hasWatchConnected = false;
            this.watchDisplayService.setWatchConnected(false);
            await this.informAboutWatchPermissionsNeed();
            return;
        }

        this.hasWatchConnected = true;
        this.watchDisplayService.setWatchConnected(true);

        awarns.emitEvent("sendWatchConnectedMessage", {
            plainMessage: {
                message: "Permissions granted",
            },
        });
    }

    async handleWatchDisconnect() {
        setWatchFeaturesState(false);
        this.hasWatchConnected = false;
        this.watchDisplayService.setWatchConnected(false);
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
