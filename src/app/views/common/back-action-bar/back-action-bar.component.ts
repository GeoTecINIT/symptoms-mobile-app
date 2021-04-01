import { Component, Input } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "SymBackActionBar",
    templateUrl: "./back-action-bar.component.html",
    styleUrls: ["./back-action-bar.component.scss"],
})
export class BackActionBarComponent {
    @Input() title: string;

    constructor(private routerExtension: RouterExtensions) {}

    onBack() {
        this.routerExtension.back();
    }
}
