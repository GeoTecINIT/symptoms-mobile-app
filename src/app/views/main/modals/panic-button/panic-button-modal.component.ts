import { Component, OnInit } from "@angular/core";
import { NavigationService } from "~/app/views/navigation.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "SymPanicButtonModal",
    templateUrl: "./panic-button-modal.component.html",
    styleUrls: ["./panic-button-modal.component.scss"],
})
export class PanicButtonModalComponent implements OnInit {
    constructor(
        private navigationService: NavigationService,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.navigationService.outletNavigation(
            { panicButtonModal: ["panic-button"] },
            this.activeRoute
        );
    }
}
