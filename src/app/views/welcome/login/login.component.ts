import { Component, OnInit } from "@angular/core";
import { InAppBrowserService } from "~/app/views/common/in-app-browser.service";

@Component({
    selector: "SymLogin",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
    constructor(private inAppBrowserService: InAppBrowserService) {
        // Initialize dependencies here
    }

    ngOnInit() {
        // Use initialized dependencies
    }

    onOpenWebsiteTap() {
        this.inAppBrowserService.openProjectWebSite();
    }
}
