import { Component, Input } from "@angular/core";

@Component({
    selector: "SymSlideNavigationButton",
    templateUrl: "./slide-navigation-button.component.html",
    styleUrls: ["./slide-navigation-button.component.scss"],
})
export class SlideNavigationButtonComponent {
    @Input() text: string;
    @Input() route: Array<any>;
    @Input() class = "btn btn-primary";
    @Input() clearHistory = false;
}
