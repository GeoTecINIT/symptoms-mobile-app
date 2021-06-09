import { Component, OnInit } from "@angular/core";

import { NavigationService } from "~/app/views/navigation.service";

import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "SymNotificationsModal",
    templateUrl: "./simulation-modal.component.html",
    styleUrls: ["./simulation-modal.component.scss"],
})
export class SimulationModalComponent implements OnInit {
    constructor(
        private navigationService: NavigationService,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.navigationService.outletNavigation(
            { simulationModal: ["simulation"] },
            this.activeRoute
        );
    }
}
