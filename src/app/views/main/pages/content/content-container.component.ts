import { Component, HostListener, NgZone } from "@angular/core";
import {
    TreatmentContent,
    TreatmentContentService,
} from "~/app/views/treatment-content.service";
import { Subject } from "rxjs";
import { ContentViewModalService } from "~/app/views/main/modals/content-view";
import { takeUntil } from "rxjs/operators";
import { getLogger, Logger } from "~/app/core/utils/logger";

@Component({
    selector: "SymContentContainer",
    templateUrl: "./content-container.component.html",
    styleUrls: ["./content-container.component.scss"],
})
export class ContentContainerComponent {
    psychoeducations: Array<TreatmentContent>;

    private unloaded$ = new Subject<void>();
    private logger: Logger;

    constructor(
        private treatmentContentService: TreatmentContentService,
        private contentViewModalService: ContentViewModalService,
        private ngZone: NgZone
    ) {
        this.logger = getLogger("ContentContainerComponent");
    }

    @HostListener("loaded")
    onLoaded() {
        this.subscribeToContentChanges();
    }

    @HostListener("unloaded")
    onUnloaded() {
        this.unloaded$.next();
    }

    onContentTap(content: TreatmentContent) {
        const { id } = content;
        this.contentViewModalService
            .showContent(id)
            .catch((err) =>
                this.logger.error(
                    `Could not show content (${id}). Reason: ${err}`
                )
            );
    }

    private subscribeToContentChanges() {
        this.treatmentContentService.psychoeducations$
            .pipe(takeUntil(this.unloaded$))
            .subscribe((psychoeducations) => {
                this.ngZone.run(() => {
                    this.psychoeducations = psychoeducations;
                });
            });
    }
}
