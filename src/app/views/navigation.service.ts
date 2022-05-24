import { Injectable, NgZone } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute } from "@angular/router";
import { getLogger, Logger } from "~/app/core/utils/logger";

const DEFAULT_TRANSITION = "slide";
const DEFAULT_DURATION = 300;

@Injectable({
    providedIn: "root",
})
export class NavigationService {
    private logger: Logger;

    constructor(
        private routerExtension: RouterExtensions,
        private ngZone: NgZone
    ) {
        this.logger = getLogger("NavigationService");
    }

    navigate(route: Array<any>, options: NavigationOptions = {}) {
        const { source, transition, duration, clearHistory, state } =
            addNavigationDefaults(options);
        this.ngZone.run(() => {
            this.routerExtension
                .navigate(route, {
                    relativeTo: source,
                    transition: { name: transition, duration },
                    clearHistory,
                    state,
                })
                .catch((e) =>
                    this.logger.error(
                        `Could not navigate to ${route}. Reason: ${e}`
                    )
                );
        });
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

    goBack() {
        this.routerExtension.back();
    }
}

type FlipTransition = "flip" | "flipRight" | "flipLeft";
type SlideTransition =
    | "slide"
    | "slideRight"
    | "slideLeft"
    | "slideTop"
    | "slideBottom";

interface NavigationOptions {
    source?: ActivatedRoute;
    clearHistory?: boolean;
    transition?: "fade" | FlipTransition | SlideTransition;
    duration?: number;
    state?: { [key: string]: any };
}

function addNavigationDefaults(options: NavigationOptions): NavigationOptions {
    const copy = { ...options };
    if (options.clearHistory === undefined) {
        copy.clearHistory = false;
    }
    if (options.transition === undefined) {
        copy.transition = DEFAULT_TRANSITION;
    }
    if (options.duration === undefined) {
        copy.duration = DEFAULT_DURATION;
    }

    return copy;
}
