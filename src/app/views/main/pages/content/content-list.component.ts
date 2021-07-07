import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";

import {
    TreatmentContent,
    TreatmentContentService,
} from "~/app/views/treatment-content.service";
import { ContentViewModalService } from "../../modals/content-view";
import { Subscription } from "rxjs";
import { appEvents } from "~/app/core/app-events";
import { Application } from "@nativescript/core";

const APP_EVENTS_KEY = "ContentListComponent";

@Component({
    selector: "SymContentList",
    templateUrl: "./content-list.component.html",
    styleUrls: ["./content-list.component.scss"],
})
export class ContentListComponent implements OnInit, OnDestroy {
    contents: Array<TreatmentContent>;

    private contentChangesSub: Subscription;

    constructor(
        private treatmentContentService: TreatmentContentService,
        private contentViewModalService: ContentViewModalService,
        private ngZone: NgZone
    ) {}

    ngOnInit() {
        this.subscribeToContentChanges();
        appEvents.on(Application.resumeEvent, APP_EVENTS_KEY, () => {
            this.subscribeToContentChanges();
        });
        appEvents.on(Application.suspendEvent, APP_EVENTS_KEY, () => {
            this.unsubscribeFromContentChanges();
        });
    }

    ngOnDestroy() {
        this.unsubscribeFromContentChanges();
    }

    onListItemTap(args: any) {
        const content = this.contents[args.index];
        this.onOpenContent(content.id);
    }

    private subscribeToContentChanges() {
        if (this.contentChangesSub) return;

        this.contentChangesSub = this.treatmentContentService.contents$.subscribe(
            (contents) => {
                this.ngZone.run(() => {
                    this.contents = contents;
                });
            }
        );
    }

    private unsubscribeFromContentChanges() {
        if (!this.contentChangesSub) return;
        this.contentChangesSub.unsubscribe();
        this.contentChangesSub = undefined;
    }

    private onOpenContent(id: string) {
        this.contentViewModalService.showContent(id);
    }
}
