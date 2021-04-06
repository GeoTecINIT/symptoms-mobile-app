import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "SymContentViewModal",
    templateUrl: "./content-view-modal.component.html",
    styleUrls: ["./content-view-modal.component.scss"],
})
export class ContentViewModalComponent implements OnInit {
    constructor(
        private routerExtension: RouterExtensions,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.routerExtension
            .navigate([{ outlets: { contentViewModal: ["content-view"] } }], {
                relativeTo: this.activeRoute,
                animated: false,
            })
            .catch((e) =>
                console.error("Could not navigate to content view:", e)
            );
    }
}
