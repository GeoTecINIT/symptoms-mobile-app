import { Component, HostListener, NgZone } from "@angular/core";
import { getConfig } from "~/app/core/config";
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
import { Subject } from "rxjs";
import { Exposure } from "~/app/core/persistence/exposures";
import { BarSegment } from "./exposure-progress-bar";
import { takeUntil } from "rxjs/operators";

const exposureTimes = getConfig().exposureTimes;
const REGULAR_EXPOSURE_TIME = exposureTimes.regular;
const EXTENSION_TIME = exposureTimes.extension;

@Component({
    selector: "SymUnderExposure",
    templateUrl: "./under-exposure.component.html",
    styleUrls: ["./under-exposure.component.scss"],
})
export class UnderExposureComponent {
    progressSegments: Array<BarSegment> = [
        {
            from: 0,
            to: REGULAR_EXPOSURE_TIME,
            note: `Total: ~${REGULAR_EXPOSURE_TIME - 2} min.`,
            progressColorClass: "bg-complementary",
            backgroundColorClass: "bg-grey",
            defaultVisibility: "visible",
        },
        {
            from: REGULAR_EXPOSURE_TIME + 1,
            to: REGULAR_EXPOSURE_TIME + EXTENSION_TIME,
            note: `+${EXTENSION_TIME}`,
            progressColorClass: "bg-complementary",
            backgroundColorClass: "bg-dark-grey",
            defaultVisibility: "hidden",
        },
        {
            from: REGULAR_EXPOSURE_TIME + EXTENSION_TIME + 1,
            to: REGULAR_EXPOSURE_TIME + 2 * EXTENSION_TIME,
            note: `+${EXTENSION_TIME}`,
            progressColorClass: "bg-complementary",
            backgroundColorClass: "bg-dark-grey",
            defaultVisibility: "hidden",
        },
    ];
    ongoingExposure: Exposure;
    exposureProgress: number;
    inDanger: boolean;

    private unloaded$ = new Subject();

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

    @HostListener("loaded")
    onLoaded() {
        this.subscribeToOngoingExposureChanges();
        this.subscribeToExposureProgressChanges();
        this.subscribeToInDangerChanges();
    }

    @HostListener("unloaded")
    onUnloaded() {
        this.unloaded$.next();
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

    private subscribeToOngoingExposureChanges() {
        this.underExposureService.ongoingExposure$
            .pipe(takeUntil(this.unloaded$))
            .subscribe((exposure) => {
                this.ngZone.run(() => {
                    this.ongoingExposure = exposure;
                });
            });
    }

    private subscribeToExposureProgressChanges() {
        this.underExposureService.exposureProgress$
            .pipe(takeUntil(this.unloaded$))
            .subscribe((exposureProgress) => {
                this.ngZone.run(() => {
                    this.exposureProgress = exposureProgress;
                });
            });
    }

    private subscribeToInDangerChanges() {
        this.underExposureService.inDanger$
            .pipe(takeUntil(this.unloaded$))
            .subscribe((inDanger) => {
                this.ngZone.run(() => {
                    this.inDanger = inDanger;
                });
            });
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
