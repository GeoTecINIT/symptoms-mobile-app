import { Component, EventEmitter, Input, Output } from "@angular/core";

import { TreatmentContent } from "~/app/views/treatment-content.service";

@Component({
    selector: "SymContentList",
    templateUrl: "./content-list.component.html",
    styleUrls: ["./content-list.component.scss"],
})
export class ContentListComponent {
    @Input() contents: Array<TreatmentContent>;
    @Output() listItemTapped = new EventEmitter<TreatmentContent>();

    onListItemTap(args: any) {
        const content = this.contents[args.index];
        this.listItemTapped.next(content);
    }
}
