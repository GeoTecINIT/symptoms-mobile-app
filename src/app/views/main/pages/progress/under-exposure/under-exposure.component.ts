import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { ContentViewModalService } from "~/app/views/main/modals/content-view";
import { DialogsService } from "~/app/views/common/dialogs.service";
import { FeedbackModalService } from "../../../modals/feedback";
import { getLogger, Logger } from "~/app/core/utils/logger";
import {
    confirmToContinueExposure,
    confirmWantsToLeave,
} from "~/app/core/dialogs/confirm";
import { askWantsToLeaveFeedback } from "~/app/core/modals/feedback";
import { emitExposureManuallyFinished } from "~/app/core/framework/events";
import { UnderExposureService } from "~/app/views/main/pages/progress/under-exposure/under-exposure.service";
import { Subscription } from "rxjs";
import { Exposure } from "~/app/core/persistence/exposures";

@Component({
    selector: "SymUnderExposure",
    templateUrl: "./under-exposure.component.html",
    styleUrls: ["./under-exposure.component.scss"],
})
export class UnderExposureComponent implements OnInit, OnDestroy {
    ongoingExposure: Exposure;
    inDanger: boolean;

    private logger: Logger;
    private exposureSubscription: Subscription;
    private inDangerSubscription: Subscription;

    constructor(
        private underExposureService: UnderExposureService,
        private contentViewModalService: ContentViewModalService,
        private dialogsService: DialogsService,
        private feedbackModalService: FeedbackModalService,
        private ngZone: NgZone
    ) {
        this.logger = getLogger("UnderExposureComponent");
    }

    ngOnInit() {
        this.exposureSubscription = this.underExposureService.ongoingExposure$.subscribe(
            (exposure) => {
                this.ngZone.run(() => {
                    this.ongoingExposure = exposure;
                });
            }
        );
        this.inDangerSubscription = this.underExposureService.inDanger$.subscribe(
            (inDanger) => {
                this.ngZone.run(() => {
                    this.inDanger = inDanger;
                });
            }
        );
    }

    ngOnDestroy() {
        this.exposureSubscription?.unsubscribe();
        this.inDangerSubscription?.unsubscribe();
    }

    onWantsToLeaveTap() {
        this.contentViewModalService.showContent("c03");
    }

    onCallTherapistTap() {
        this.underExposureService.callTherapist().then((success) => {
            if (success) {
                this.askIfWantsToContinue();
            }
        });
    }

    onWantsToEndExposureTap() {
        this.dialogsService
            .askConfirmationWithPositiveAction(confirmWantsToLeave)
            .then((wantsToLeave) => this.handleWantsToLeave(wantsToLeave));
    }

    private askIfWantsToContinue() {
        this.dialogsService
            .askConfirmationWithDestructiveAction(confirmToContinueExposure)
            .then((wantsToLeave) => this.handleWantsToLeave(wantsToLeave));
    }

    private handleWantsToLeave(wantsToLeave: boolean) {
        if (!wantsToLeave) return;
        emitExposureManuallyFinished();
        this.feedbackModalService
            .askFeedback("exposure-left", askWantsToLeaveFeedback)
            .catch((e) =>
                this.logger.error(`Could not deliver feedback: Reason ${e}`)
            );
    }
}
