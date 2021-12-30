import { Component, Input } from "@angular/core";

import { SettingsModalService } from "../../modals/settings/settings-modal.service";
import { SimulationModalService } from "../../modals/simulation/simulation-modal.service";
import { getConfig } from "~/app/core/config";
import { PanicButtonService } from "~/app/views/main/panic-button.service";

@Component({
    selector: "SymMainActionBar",
    templateUrl: "./main-action-bar.component.html",
    styleUrls: ["./main-action-bar.component.scss"],
})
export class MainActionBarComponent {
    @Input() title: string;
    development: boolean;

    constructor(
        private settingsModalService: SettingsModalService,
        private simulationModalService: SimulationModalService,
        private panicButtonService: PanicButtonService
    ) {
        this.development = !getConfig().production;
    }

    onSimulationTap() {
        this.simulationModalService.show();
    }

    onSettingsTap() {
        this.settingsModalService.show();
    }

    onHelpTap() {
        this.panicButtonService.intendsToMakeEmergencyCall();
    }
}
