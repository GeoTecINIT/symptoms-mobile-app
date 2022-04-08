import { Component } from "@angular/core";
import { InAppBrowserService } from "~/app/views/common/in-app-browser.service";
import { AuthService } from "~/app/views/auth.service";
import { NavigationService } from "~/app/views/navigation.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "SymLogin",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
    canContinue = false;
    waitingForResponse = false;
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
        if (!this.canContinue || this.waitingForResponse) return;

        this.waitingForResponse = true;

        this.authService.login(this.code).then((success) => {
            if (success) {
                this.navigationService.navigate(
                    ["../tutorial"],
                    this.activeRoute,
                    true
                );
            } else {
                this.waitingForResponse = false;
                this.authFailed = true;
            }
        });
    }

    onOpenWebsiteTap() {
        this.inAppBrowserService.openProjectWebSite();
    }
}
