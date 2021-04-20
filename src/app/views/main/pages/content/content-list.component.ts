import { Component, OnInit } from "@angular/core";

import {
    TreatmentContent,
    TreatmentContentService,
} from "~/app/views/treatment-content.service";
import { ContentViewModalService } from "../../modals/content-view/content-view-modal.service";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";

@Component({
    selector: "SymContentList",
    templateUrl: "./content-list.component.html",
    styleUrls: ["./content-list.component.scss"],
})
export class ContentListComponent implements OnInit {
    contents$: Observable<Array<TreatmentContent>>;

    constructor(
        private treatmentContentService: TreatmentContentService,
        private contentViewModalService: ContentViewModalService
    ) {
        this.contents$ = this.treatmentContentService.contents$;
    }

    ngOnInit() {
        // Use initialized dependencies
    }

    onListItemTap(args: any) {
        this.fetchContentByIndex(args.index).then((content) => {
            this.onOpenContent(content.id);
        });
    }

    private async fetchContentByIndex(
        index: number
    ): Promise<TreatmentContent> {
        const contents = await this.contents$.pipe(take(1)).toPromise();

        return contents[index];
    }

    private onOpenContent(id: string) {
        this.contentViewModalService.showContent(id);
    }
}
