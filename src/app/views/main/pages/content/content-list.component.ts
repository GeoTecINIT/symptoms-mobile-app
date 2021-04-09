import { Component, OnInit } from "@angular/core";

import { ContentViewModalService } from "../../modals/content-view/content-view-modal.service";

@Component({
    selector: "SymContentList",
    templateUrl: "./content-list.component.html",
    styleUrls: ["./content-list.component.scss"],
})
export class ContentListComponent implements OnInit {
    constructor(private contentViewModalService: ContentViewModalService) {
        // Initialize dependencies here
    }

    ngOnInit() {
        // Use initialized dependencies
    }

    onOpenContent() {
        this.contentViewModalService.showContent("introducción");
    }
}
