import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { SettingsModalService } from "../../modals/settings/settings-modal.service";
import { SimulationModalService } from "../../modals/simulation/simulation-modal.service";
import { getConfig } from "~/app/core/config";
import {
    AccountService,
    AdvancedSetting,
    AdvancedSettingsService,
} from "~/app/core/account";
import { PanicButtonModalService } from "~/app/views/main/modals/panic-button/panic-button-modal.service";
import { DialogsService } from "~/app/views/common/dialogs.service";
import { infoOnWatchPermissionsNeed } from "~/app/core/dialogs/info";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { Dialogs } from "@nativescript/core";
import {
    WatchDisplayService,
    WatchStatus,
} from "~/app/views/main/common/main-action-bar/watch-display.service";

@Component({
    selector: "SymMainActionBar",
    templateUrl: "./main-action-bar.component.html",
    styleUrls: ["./main-action-bar.component.scss"],
})
export class MainActionBarComponent implements OnInit, OnDestroy {
    @Input() title!: string;
    development: boolean;
    panicButtonActive: boolean;

    // Used in the template for the simulation action item guard
    testUser = this.accountService.deviceProfile.patientId;

    // Expose enum to the template (the HTML uses hasWatchAvailable / hasWatchConnected getters,
    // so the enum isn't strictly needed in the template -> kept here in case the template is extended).
    WatchStatus = WatchStatus;

    private watchStatus: WatchStatus = WatchStatus.Unavailable;
    private destroyed$ = new Subject<void>();
    private logger: Logger;

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

    get hasWatchAvailable(): boolean {
        return this.watchStatus !== WatchStatus.Unavailable;
    }

    get hasWatchConnected(): boolean {
        return this.watchStatus === WatchStatus.Connected;
    }

    async ngOnInit(): Promise<void> {
        // Mirror service state into the local watchStatus so Angular's
        // change detection picks it up for the getters above.
        this.watchDisplayService.status$
            .pipe(takeUntil(this.destroyed$))
            .subscribe((status) => {
                this.watchStatus = status;
            });

        // initialize() is idempotent -> safe to call on every ngOnInit.
        await this.watchDisplayService.initialize();
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    onWatchDialogTap() {
        if (!this.hasWatchConnected) {
            Dialogs.confirm({
                title: "Conectar reloj",
                message: "¿Permitir la recogida de datos desde el reloj?",
                okButtonText: "Sí",
                cancelButtonText: "No",
            })
                .then(async (confirmed) => {
                    if (confirmed) {
                        await this.watchDisplayService.connect(() =>
                            this.informAboutWatchPermissionsNeed(),
                        );
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
                .then(async (confirmed) => {
                    if (confirmed) {
                        await this.watchDisplayService.disconnect();
                    }
                })
                .catch((error) => {
                    this.logger.error(
                        "Error al mostrar el diálogo de confirmación: " + error,
                    );
                });
        }
    }

    onSimulationTap() {
        this.simulationModalService.show();
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
