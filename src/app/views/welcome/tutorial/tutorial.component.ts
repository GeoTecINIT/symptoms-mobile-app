import { Component, OnInit } from "@angular/core";
import { InAppBrowserService } from "~/app/views/common/in-app-browser.service";

@Component({
    selector: "SymTutorial",
    templateUrl: "./tutorial.component.html",
    styleUrls: ["./tutorial.component.scss"],
})
export class TutorialComponent implements OnInit {
    constructor(private inAppBrowserService: InAppBrowserService) {
        // Initialize dependencies here
    }

    ngOnInit() {
        // Use initialized dependencies
    }

    onOpenPrivacyPolicyTap() {
        this.inAppBrowserService.openPrivacyPolicy();
    }
}
