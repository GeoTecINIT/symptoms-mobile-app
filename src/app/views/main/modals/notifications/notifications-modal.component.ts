import { Component, OnInit } from "@angular/core";

import { NavigationService } from "~/app/views/navigation.service";

import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "SymNotificationsModal",
    templateUrl: "./notifications-modal.component.html",
    styleUrls: ["./notifications-modal.component.scss"],
})
export class NotificationsModalComponent implements OnInit {
    constructor(
        private navigationService: NavigationService,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.navigationService.outletNavigation(
            { notificationsModal: ["notifications"] },
            this.activeRoute
        );
    }
}
