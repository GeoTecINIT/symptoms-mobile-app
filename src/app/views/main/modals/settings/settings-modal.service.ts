import { Injectable } from "@angular/core";
import { SettingsModule } from "./settings.module";

import { MainViewService } from "../../main-view.service";

import { SettingsModalComponent } from "./settings-modal.component";

@Injectable({
    providedIn: SettingsModule,
})
export class SettingsModalService {
    constructor(private mainViewService: MainViewService) {}

    show() {
        this.mainViewService
            .showFullScreenAnimatedModal(SettingsModalComponent)
            .catch((e) =>
                console.error(`Error while opening settings modal:`, e)
            );
    }
}
