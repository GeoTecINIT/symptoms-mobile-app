import { Component, OnInit } from "@angular/core";
import { NavigationService } from "~/app/views/navigation.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "SymFeedbackModal",
    templateUrl: "./feedback-modal.component.html",
    styleUrls: ["./feedback-modal.component.scss"],
})
export class FeedbackModalComponent implements OnInit {
    constructor(
        private navigationService: NavigationService,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.navigationService.outletNavigation(
            { feedbackModal: ["feedback"] },
            this.activeRoute
        );
    }
}
