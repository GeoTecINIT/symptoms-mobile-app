import { Component, Input } from "@angular/core";

import { SettingsModalService } from "../../modals/settings/settings-modal.service";
import { SimulationModalService } from "../../modals/simulation/simulation-modal.service";
import { getConfig } from "~/app/core/config";
import { AdvancedSetting, AdvancedSettingsService } from "~/app/core/account";
import { PanicButtonModalService } from "~/app/views/main/modals/panic-button/panic-button-modal.service";

@Component({
    selector: "SymMainActionBar",
    templateUrl: "./main-action-bar.component.html",
    styleUrls: ["./main-action-bar.component.scss"],
})
export class MainActionBarComponent {
    @Input() title: string;
    development: boolean;

    panicButtonActive: boolean;

    constructor(
        private settingsModalService: SettingsModalService,
        private simulationModalService: SimulationModalService,
        private advancedSettingsService: AdvancedSettingsService,
        private panicButtonModalService: PanicButtonModalService
    ) {
        this.development = !getConfig().production;
        this.panicButtonActive = this.advancedSettingsService.getBoolean(
            AdvancedSetting.PanicButton
        );
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
}
