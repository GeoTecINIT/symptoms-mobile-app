import { Component } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import {
    TreatmentContent,
    TreatmentContentService,
} from "~/app/views/treatment-content.service";
import { EventData, ScrollView, StackLayout } from "@nativescript/core";

const CONTENT_END_OFFSET = 10;

@Component({
    selector: "SymContentViewContainer",
    templateUrl: "./content-view-container.component.html",
    styleUrls: ["./content-view-container.component.scss"],
})
export class ContentViewContainerComponent {
    content$: Promise<TreatmentContent>;

    private readonly contentId: string;
    private contentHeight: number;
    private seen: boolean;

    constructor(
        private params: ModalDialogParams,
        private treatmentContentService: TreatmentContentService
    ) {
        this.contentId = params.context.id;
        this.content$ = this.treatmentContentService.getById(this.contentId);
        this.content$.then((content) => (this.seen = content.seen));
    }

    onClose() {
        this.params.closeCallback();
    }

    onContentRendered(event: EventData) {
        const layout = event.object as StackLayout;
        this.contentHeight = layout.getActualSize().height;
    }

    onScroll(event: EventData) {
        const scroll = event.object as ScrollView;
        const scrollPositionEnd =
            scroll.getActualSize().height + scroll.verticalOffset;

        if (this.hasReachedTheEndAndIsTheFirstRead(scrollPositionEnd)) {
            this.seen = true;
            this.treatmentContentService
                .markAsSeen(this.contentId)
                .catch((e) =>
                    console.error("Could not mark content as seen. Reason:", e)
                );
        }
    }

    private hasReachedTheEndAndIsTheFirstRead(scrollPositionEnd: number) {
        if (this.seen) return false;
        if (this.contentHeight === undefined) return false;

        return (
            Math.abs(this.contentHeight - scrollPositionEnd) <
            CONTENT_END_OFFSET
        );
    }
}
