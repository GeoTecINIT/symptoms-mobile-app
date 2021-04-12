import { Injectable } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class NavigationService {
    constructor(private routerExtension: RouterExtensions) {}

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
                console.error(`Could not navigate to ${route}. Reason: `, e)
            );
    }
}
