import { Component, Input } from "@angular/core";

import { SettingsModalService } from "../../modals/settings/settings-modal.service";
import { NotificationsModalService } from "../../modals/notifications/notifications-modal.service";

@Component({
    selector: "SymMainActionBar",
    templateUrl: "./main-action-bar.component.html",
    styleUrls: ["./main-action-bar.component.scss"],
})
export class MainActionBarComponent {
    @Input() title: string;

    constructor(
        private settingsModalService: SettingsModalService,
        private notificationsModalService: NotificationsModalService
    ) {}

    onNotificationsTap() {
        this.notificationsModalService.show();
    }

    onSettingsTap() {
        this.settingsModalService.show();
    }
}
