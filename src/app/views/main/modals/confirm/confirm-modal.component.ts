import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "SymConfirmModal",
    templateUrl: "./confirm-modal.component.html",
    styleUrls: ["./confirm-modal.component.scss"],
})
export class ConfirmModalComponent implements OnInit {
    constructor(
        private routerExtension: RouterExtensions,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.routerExtension
            .navigate([{ outlets: { confirmModal: ["confirm"] } }], {
                relativeTo: this.activeRoute,
            })
            .catch((e) =>
                console.error(
                    "Could not navigate to confirm modal container:",
                    e
                )
            );
    }
}
