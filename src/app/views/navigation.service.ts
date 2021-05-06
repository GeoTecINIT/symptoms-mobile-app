import { Injectable } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute } from "@angular/router";
import { getLogger, Logger } from "~/app/core/utils/logger";

@Injectable({
    providedIn: "root",
})
export class NavigationService {
    private logger: Logger;

    constructor(private routerExtension: RouterExtensions) {
        this.logger = getLogger("NavigationService");
    }

    navigate(
        route: Array<any>,
        source: ActivatedRoute,
        clearHistory: boolean = false
    ) {
        this.routerExtension
            .navigate(route, {
                relativeTo: source,
                transition: { name: "slide", duration: 300 },
                clearHistory,
            })
            .catch((e) =>
                this.logger.error(
                    `Could not navigate to ${route}. Reason: ${e}`
                )
            );
    }

    forceNavigate(absoluteRoute: Array<any>) {
        this.routerExtension
            .navigate(absoluteRoute, {
                animated: false,
                clearHistory: true,
            })
            .catch((e) =>
                this.logger.error(
                    `Could not navigate to ${absoluteRoute}. Reason: ${e}`
                )
            );
    }

    outletNavigation(
        outlets: { [key: string]: Array<any> },
        source: ActivatedRoute
    ) {
        this.routerExtension
            .navigate([{ outlets }], { relativeTo: source })
            .catch((e) =>
                this.logger.error(
                    `Could not navigate ${outlets} outlets. Reason: ${e}`
                )
            );
    }
}
