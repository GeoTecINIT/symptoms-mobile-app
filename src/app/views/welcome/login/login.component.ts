import { Component } from "@angular/core";
import { InAppBrowserService } from "~/app/views/common/in-app-browser.service";
import { AuthService } from "~/app/views/auth.service.ts";
import { NavigationService } from "~/app/views/navigation.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "SymLogin",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
    canContinue = false;
    authFailed = false;

    private code: string;

    constructor(
        private authService: AuthService,
        private navigationService: NavigationService,
        private inAppBrowserService: InAppBrowserService,
        private activeRoute: ActivatedRoute
    ) {}

    onCodeInputChange(code: string) {
        this.authFailed = false;
        this.code = code.trim();
        this.canContinue = this.code !== "";
    }

    onContinueTap() {
        this.authService.login(this.code).then((success) => {
            if (success) {
                this.navigationService.navigate(
                    ["../tutorial"],
                    this.activeRoute,
                    true
                );
            } else {
                this.authFailed = true;
            }
        });
    }

    onOpenWebsiteTap() {
        this.inAppBrowserService.openProjectWebSite();
    }
}
