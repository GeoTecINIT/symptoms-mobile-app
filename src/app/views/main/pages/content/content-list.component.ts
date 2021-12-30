import { Component, HostListener, NgZone } from "@angular/core";

import {
    TreatmentContent,
    TreatmentContentService,
} from "~/app/views/treatment-content.service";
import { ContentViewModalService } from "../../modals/content-view";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "SymContentList",
    templateUrl: "./content-list.component.html",
    styleUrls: ["./content-list.component.scss"],
})
export class ContentListComponent {
    contents: Array<TreatmentContent>;

    private unloaded$ = new Subject();

    constructor(
        private treatmentContentService: TreatmentContentService,
        private contentViewModalService: ContentViewModalService,
        private ngZone: NgZone
    ) {}

    @HostListener("loaded")
    onLoaded() {
        this.subscribeToContentChanges();
    }

    @HostListener("unloaded")
    onUnloaded() {
        this.unloaded$.next();
    }

    onListItemTap(args: any) {
        const content = this.contents[args.index];
        this.onOpenContent(content.id);
    }

    private subscribeToContentChanges() {
        this.treatmentContentService.psychoeducations$
            .pipe(takeUntil(this.unloaded$))
            .subscribe((contents) => {
                this.ngZone.run(() => {
                    this.contents = contents;
                });
            });
    }

    private onOpenContent(id: string) {
        this.contentViewModalService.showContent(id);
    }
}
