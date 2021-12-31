import { Component, Input, OnInit } from "@angular/core";
import { TreatmentContent } from "~/app/views/treatment-content.service";

@Component({
    selector: "SymContentListItem",
    templateUrl: "./content-list-item.component.html",
    styleUrls: ["./content-list-item.component.scss"],
})
export class ContentListItemComponent implements OnInit {
    @Input() content: TreatmentContent;

    get formattedIndex(): string {
        return this.content.index.toString().padStart(2, "0");
    }

    constructor() {
        // Initialize dependencies here
    }

    ngOnInit() {
        // Use initialized dependencies
    }
}
