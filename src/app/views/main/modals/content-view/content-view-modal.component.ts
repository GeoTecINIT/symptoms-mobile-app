import { Component, OnDestroy, OnInit } from "@angular/core";
import {
    AndroidApplication,
    Application,
    EventData,
    ScrollView,
    StackLayout,
} from "@nativescript/core";

import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "~/app/views/navigation.service";
import { ContentViewModalService } from "./content-view-modal.service";
import {
    TreatmentContent,
    TreatmentContentService,
} from "~/app/views/treatment-content.service";

import { getLogger, Logger } from "~/app/core/utils/logger";

export const CONTENT_ID_KEY = "contentId";
const CONTENT_END_OFFSET = 10;

@Component({
    selector: "SymContentViewModal",
    templateUrl: "./content-view-modal.component.html",
    styleUrls: ["./content-view-modal.component.scss"],
})
export class ContentViewModalComponent implements OnInit, OnDestroy {
    content$: Promise<TreatmentContent>;

    private readonly contentId: string;
    private contentHeight: number;
    private seenBefore: boolean;
    private seenDuringSession = false;
    private logger: Logger;

    private readonly backCallback: () => void;

    constructor(
        activeRoute: ActivatedRoute,
        private navigationService: NavigationService,
        private contentViewModalService: ContentViewModalService,
        private treatmentContentService: TreatmentContentService
    ) {
        this.logger = getLogger("ContentViewModalComponent");
        this.contentId = activeRoute.snapshot.paramMap.get(CONTENT_ID_KEY);
        this.content$ = this.treatmentContentService.getById(this.contentId);
        this.content$.then((content) => (this.seenBefore = content.seen));

        this.backCallback = () => {
            this.reportSeenStatus();
        };
    }

    ngOnInit() {
        Application.android.on(
            AndroidApplication.activityBackPressedEvent,
            this.backCallback
        );
    }

    ngOnDestroy() {
        Application.android.off(
            AndroidApplication.activityBackPressedEvent,
            this.backCallback
        );
    }

    onClose() {
        this.navigationService.goBack();
        this.reportSeenStatus();
    }

    onContentRendered(event: EventData) {
        const layout = event.object as StackLayout;
        this.contentHeight = layout.getActualSize().height;
    }

    onScroll(event: EventData) {
        const scroll = event.object as ScrollView;
        const scrollPositionEnd =
            scroll.getActualSize().height + scroll.verticalOffset;

        if (this.hasReachedTheEnd(scrollPositionEnd)) {
            this.seenDuringSession = true;

            if (!this.seenBefore) {
                this.treatmentContentService
                    .markAsSeen(this.contentId)
                    .catch((e) =>
                        this.logger.error(
                            `Could not mark content as seen. Reason: ${e}`
                        )
                    );
            }
        }
    }

    private hasReachedTheEnd(scrollPositionEnd: number) {
        if (this.contentHeight === undefined) return false;

        return (
            Math.abs(this.contentHeight - scrollPositionEnd) <
            CONTENT_END_OFFSET
        );
    }

    private reportSeenStatus() {
        this.contentViewModalService.contentWasSeen(
            this.contentId,
            this.seenDuringSession
        );
    }
}
