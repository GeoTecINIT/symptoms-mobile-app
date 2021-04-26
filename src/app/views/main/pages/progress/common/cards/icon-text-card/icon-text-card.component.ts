import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "SymIconTextCard",
    templateUrl: "./icon-text-card.component.html",
    styleUrls: ["./icon-text-card.component.scss"],
})
export class IconTextCardComponent implements OnInit {
    @Input()
    iconCode = "";
    @Input()
    text = "";
    constructor() {
        // Initialize deps here
    }

    ngOnInit(): void {
        // Use deps here
    }
}
