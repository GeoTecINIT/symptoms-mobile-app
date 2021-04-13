import { Component, OnInit } from "@angular/core";

import { NavigationService } from "~/app/views/navigation.service";

import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "SymConfirmModal",
    templateUrl: "./confirm-modal.component.html",
    styleUrls: ["./confirm-modal.component.scss"],
})
export class ConfirmModalComponent implements OnInit {
    constructor(
        private navigationService: NavigationService,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.navigationService.outletNavigation(
            { confirmModal: ["confirm"] },
            this.activeRoute
        );
    }
}
