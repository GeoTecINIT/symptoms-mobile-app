import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "SymSlideNavigationButton",
    templateUrl: "./slide-navigation-button.component.html",
    styleUrls: ["./slide-navigation-button.component.scss"],
})
export class SlideNavigationButtonComponent implements OnInit {
    @Input() text: string;
    @Input() route: Array<any>;
    @Input() class: string;

    ngOnInit() {
        if (!this.class) {
            this.class = "btn btn-primary";
        }
    }
}
