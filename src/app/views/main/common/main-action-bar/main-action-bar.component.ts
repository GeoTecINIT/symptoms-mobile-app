import { Component, Input } from "@angular/core";

import { SettingsModalService } from "../../modals/settings/settings-modal.service";

@Component({
    selector: "SymMainActionBar",
    templateUrl: "./main-action-bar.component.html",
    styleUrls: ["./main-action-bar.component.scss"],
})
export class MainActionBarComponent {
    @Input() title: string;

    constructor(private settingsModalService: SettingsModalService) {}

    onNotificationsTap() {
        // Show notifications modal
    }

    onSettingsTap() {
        this.settingsModalService.show();
    }
}
