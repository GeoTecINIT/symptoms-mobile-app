import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "SymSettingsModal",
    templateUrl: "./settings-modal.component.html",
    styleUrls: ["./settings-modal.component.scss"],
})
export class SettingsModalComponent implements OnInit {
    constructor(
        private routerExtension: RouterExtensions,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.routerExtension
            .navigate(
                [
                    {
                        outlets: {
                            settingsModal: ["settings"],
                        },
                    },
                ],
                { relativeTo: this.activeRoute, animated: false }
            )
            .catch((e) =>
                console.error("Error navigating to settings container: ", e)
            );
    }
}
