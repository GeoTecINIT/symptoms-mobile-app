import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "SymFeedbackModal",
    templateUrl: "./feedback-modal.component.html",
    styleUrls: ["./feedback-modal.component.scss"],
})
export class FeedbackModalComponent implements OnInit {
    constructor(
        private routerExtension: RouterExtensions,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.routerExtension
            .navigate([{ outlets: { feedbackModal: ["feedback"] } }], {
                relativeTo: this.activeRoute,
            })
            .catch((e) =>
                console.error("Could not navigate to feedback container:", e)
            );
    }
}
