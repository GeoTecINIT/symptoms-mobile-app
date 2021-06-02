import { Component, OnInit } from "@angular/core";
import { DialogsService } from "~/app/views/common/dialogs.service";
import { FeedbackModalService } from "../../../modals/feedback";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { dangersOfEarlyLeave } from "~/app/core/dialogs/info";
import {
    confirmToContinueExposure,
    confirmWantsToLeave,
} from "~/app/core/dialogs/confirm";
import { askWantsToLeaveFeedback } from "~/app/core/modals/feedback";
import { emitExposureManuallyFinished } from "~/app/core/framework/events";
import { UnderExposureService } from "~/app/views/main/pages/progress/under-exposure/under-exposure.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { map } from "rxjs/internal/operators";

@Component({
    selector: "SymUnderExposure",
    templateUrl: "./under-exposure.component.html",
    styleUrls: ["./under-exposure.component.scss"],
})
export class UnderExposureComponent implements OnInit {
    exposurePlaceName$: Observable<string>;
    inDanger$: Observable<boolean>;

    private logger: Logger;

    constructor(
        private underExposureService: UnderExposureService,
        private dialogsService: DialogsService,
        private feedbackModalService: FeedbackModalService
    ) {
        this.logger = getLogger("UnderExposureComponent");

        this.exposurePlaceName$ = this.underExposureService.ongoingExposure$.pipe(
            tap((exposure) => console.log(exposure)),
            map((exposure) => (exposure ? exposure.place.name : ""))
        );
        this.inDanger$ = this.underExposureService.inDanger$.pipe(
            tap((inDanger) => console.log(inDanger))
        );
    }

    ngOnInit() {
        // Use initialized dependencies
    }

    onWantsToLeaveTap() {
        this.dialogsService.showInfo(dangersOfEarlyLeave);
    }

    onAskToContinue() {
        this.dialogsService
            .askConfirmationWithDestructiveAction(confirmToContinueExposure)
            .then((wantsToLeave) => this.handleWantsToLeave(wantsToLeave));
    }

    onEndExposureTap() {
        this.dialogsService
            .askConfirmationWithPositiveAction(confirmWantsToLeave)
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
