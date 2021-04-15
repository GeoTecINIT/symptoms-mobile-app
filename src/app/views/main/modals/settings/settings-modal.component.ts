import { Component, OnInit } from "@angular/core";

import { NavigationService } from "~/app/views/navigation.service";

import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "SymSettingsModal",
    templateUrl: "./settings-modal.component.html",
    styleUrls: ["./settings-modal.component.scss"],
})
export class SettingsModalComponent implements OnInit {
    constructor(
        private navigationService: NavigationService,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.navigationService.outletNavigation(
            { settingsModal: ["settings"] },
            this.activeRoute
        );
    }
}
