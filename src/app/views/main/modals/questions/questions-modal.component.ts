import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "SymQuestionsModal",
    templateUrl: "./questions-modal.component.html",
    styleUrls: ["./questions-modal.component.scss"],
})
export class QuestionsModalComponent implements OnInit {
    constructor(
        private routerExtension: RouterExtensions,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.routerExtension
            .navigate([{ outlets: { questionsModal: ["questions"] } }], {
                relativeTo: this.activeRoute,
            })
            .catch((e) =>
                console.error(
                    "Could not navigate to questions modal container:",
                    e
                )
            );
    }
}
