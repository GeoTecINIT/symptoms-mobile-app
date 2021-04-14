import { Injectable } from "@angular/core";
import { CommonComponentsModule } from "./common-components.module";
import { InAppBrowser } from "nativescript-inappbrowser";
import { Utils } from "@nativescript/core";

const actionBarBgColor = "#FAFAFA";
const actionBarTextColor = "#212121";

const domain = "symptoms.uji.es";
const privacyPolicyRoute = "/privacy-policy";

@Injectable({
    providedIn: CommonComponentsModule,
})
export class InAppBrowserService {
    openProjectWebSite(path: string = "") {
        this.openUrl(`https://${domain}${path}`).catch((e) =>
            console.error("Could not open URL in in-app browser:", e)
        );
    }

    openPrivacyPolicy() {
        this.openProjectWebSite(privacyPolicyRoute);
    }

    async openUrl(url: string): Promise<void> {
        if (await InAppBrowser.isAvailable()) {
            await this.openInInAppBrowser(url);
        } else {
            this.openInDefaultExternalBrowser(url);
        }
    }

    private async openInInAppBrowser(url: string): Promise<void> {
        try {
            await InAppBrowser.open(url, {
                // iOS Properties
                dismissButtonStyle: "close",
                preferredBarTintColor: actionBarBgColor,
                preferredControlTintColor: actionBarTextColor,
                readerMode: false,
                animated: true,
                modalPresentationStyle: "fullScreen",
                modalTransitionStyle: "partialCurl",
                modalEnabled: true,
                enableBarCollapsing: false,
                // Android Properties
                showTitle: true,
                toolbarColor: actionBarBgColor,
                secondaryToolbarColor: actionBarTextColor,
                enableUrlBarHiding: true,
                enableDefaultShare: false,
                forceCloseOnRedirection: false,
                // Specify full animation resource identifier(package:anim/name)
                // or only resource name(in case of animation bundled with app).
                animations: {
                    startEnter: "slide_in_right",
                    startExit: "slide_out_left",
                    endEnter: "slide_in_left",
                    endExit: "slide_out_right",
                },
            });
        } catch (e) {
            console.error(
                "Could not open url, falling back to default mechanism. Error: ",
                e
            );
            this.openInDefaultExternalBrowser(url);
        }
    }

    private openInDefaultExternalBrowser(url: string) {
        Utils.openUrl(url);
    }
}
