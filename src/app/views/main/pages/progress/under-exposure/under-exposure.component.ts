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
import { appEvents } from "~/app/core/app-events";
import { Application } from "@nativescript/core";

const APP_EVENTS_KEY = "UnderExposureComponent";

@Component({
    selector: "SymUnderExposure",
    templateUrl: "./under-exposure.component.html",
    styleUrls: ["./under-exposure.component.scss"],
})
export class UnderExposureComponent implements OnInit, OnDestroy {
    ongoingExposure: Exposure;
    inDanger: boolean;

    private ongoingExposureSub: Subscription;
    private inDangerSub: Subscription;

    private logger: Logger;

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
        this.subscribeAll();
        appEvents.on(Application.resumeEvent, APP_EVENTS_KEY, () => {
            this.subscribeAll();
        });
        appEvents.on(Application.suspendEvent, APP_EVENTS_KEY, () => {
            this.unsubscribeAll();
        });
    }

    ngOnDestroy() {
        this.unsubscribeAll();
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

    private subscribeAll() {
        this.subscribeToOngoingExposureChanges();
        this.subscribeToInDangerChanges();
    }

    private unsubscribeAll() {
        this.unsubscribeFromOngoingExposureChanges();
        this.unsubscribeFromInDangerChanges();
    }

    private subscribeToOngoingExposureChanges() {
        if (this.ongoingExposureSub) return;

        this.ongoingExposureSub = this.underExposureService.ongoingExposure$.subscribe(
            (exposure) => {
                this.ngZone.run(() => {
                    this.ongoingExposure = exposure;
                });
            }
        );
    }

    private unsubscribeFromOngoingExposureChanges() {
        if (!this.ongoingExposureSub) return;
        this.ongoingExposureSub.unsubscribe();
        this.ongoingExposureSub = undefined;
    }

    private subscribeToInDangerChanges() {
        if (this.inDangerSub) return;

        this.inDangerSub = this.underExposureService.inDanger$.subscribe(
            (inDanger) => {
                this.ngZone.run(() => {
                    this.inDanger = inDanger;
                });
            }
        );
    }

    private unsubscribeFromInDangerChanges() {
        if (!this.inDangerSub) return;
        this.inDangerSub.unsubscribe();
        this.inDangerSub = undefined;
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
