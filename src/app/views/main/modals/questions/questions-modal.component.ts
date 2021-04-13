import { Component, OnInit } from "@angular/core";

import { NavigationService } from "~/app/views/navigation.service";

import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "SymQuestionsModal",
    templateUrl: "./questions-modal.component.html",
    styleUrls: ["./questions-modal.component.scss"],
})
export class QuestionsModalComponent implements OnInit {
    constructor(
        private navigationService: NavigationService,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.navigationService.outletNavigation(
            { questionsModal: ["questions"] },
            this.activeRoute
        );
    }
}
