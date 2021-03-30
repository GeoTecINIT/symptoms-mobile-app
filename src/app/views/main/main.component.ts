import { Component, OnInit } from "@angular/core";

import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";

import { Page } from "tns-core-modules/ui/page/page";

@Component({
    selector: "SymMain",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
    constructor(
        private routerExtension: RouterExtensions,
        private activeRoute: ActivatedRoute,
        page: Page
    ) {
        page.actionBarHidden = true;
    }

    ngOnInit() {
        this.routerExtension
            .navigate(
                [
                    {
                        outlets: {
                            progressTab: ["progress"],
                            contentTab: ["content"],
                            simulationTab: ["simulation"],
                        },
                    },
                ],
                { relativeTo: this.activeRoute }
            )
            .catch((e) => console.error("On MainComponent navigation:", e));
    }
}
