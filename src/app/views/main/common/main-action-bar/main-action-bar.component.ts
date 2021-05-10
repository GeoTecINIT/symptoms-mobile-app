import { Component, Input } from "@angular/core";

import { SettingsModalService } from "../../modals/settings/settings-modal.service";
import { NotificationsModalService } from "../../modals/notifications/notifications-modal.service";
import { NotificationsReaderService } from "../../notifications-reader.service";
import { Observable } from "rxjs";

@Component({
    selector: "SymMainActionBar",
    templateUrl: "./main-action-bar.component.html",
    styleUrls: ["./main-action-bar.component.scss"],
})
export class MainActionBarComponent {
    @Input() title: string;

    get unread$(): Observable<boolean> {
        return this.notificationsReaderService.unread$;
    }

    constructor(
        private settingsModalService: SettingsModalService,
        private notificationsModalService: NotificationsModalService,
        private notificationsReaderService: NotificationsReaderService
    ) {}

    onNotificationsTap() {
        this.notificationsModalService.show();
    }

    onSettingsTap() {
        this.settingsModalService.show();
    }
}
