import { Component, OnInit } from "@angular/core";

import { NavigationService } from "~/app/views/navigation.service";

import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "SymContentViewModal",
    templateUrl: "./content-view-modal.component.html",
    styleUrls: ["./content-view-modal.component.scss"],
})
export class ContentViewModalComponent implements OnInit {
    constructor(
        private navigationService: NavigationService,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.navigationService.outletNavigation(
            { contentViewModal: ["content-view"] },
            this.activeRoute
        );
    }
}
