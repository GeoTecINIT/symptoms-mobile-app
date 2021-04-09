import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "SymNotificationsModal",
    templateUrl: "./notifications-modal.component.html",
    styleUrls: ["./notifications-modal.component.scss"],
})
export class NotificationsModalComponent implements OnInit {
    constructor(
        private routerExtension: RouterExtensions,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.routerExtension
            .navigate(
                [{ outlets: { notificationsModal: ["notifications"] } }],
                { relativeTo: this.activeRoute }
            )
            .catch((e) =>
                console.error("Could not navigate to notifications list:", e)
            );
    }
}
