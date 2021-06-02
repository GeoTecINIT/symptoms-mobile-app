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

@Component({
    selector: "SymUnderExposure",
    templateUrl: "./under-exposure.component.html",
    styleUrls: ["./under-exposure.component.scss"],
})
export class UnderExposureComponent implements OnInit {
    inDanger = false;

    private logger: Logger;

    constructor(
        private dialogsService: DialogsService,
        private feedbackModalService: FeedbackModalService
    ) {
        this.logger = getLogger("UnderExposureComponent");
    }

    ngOnInit() {
        // Use initialized dependencies
    }

    onSwitchStatus() {
        this.inDanger = !this.inDanger;
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
