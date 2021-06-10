import { Component, OnInit } from "@angular/core";
import { ContentViewModalService } from "~/app/views/main/modals/content-view";
import { DialogsService } from "~/app/views/common/dialogs.service";
import { FeedbackModalService } from "../../../modals/feedback";
import { ProgressViewService } from "../progress-view.service";
import { getLogger, Logger } from "~/app/core/utils/logger";
import {
    confirmToContinueExposure,
    confirmWantsToLeave,
} from "~/app/core/dialogs/confirm";
import { askWantsToLeaveFeedback } from "~/app/core/modals/feedback";

@Component({
    selector: "SymUnderExposure",
    templateUrl: "./under-exposure.component.html",
    styleUrls: ["./under-exposure.component.scss"],
})
export class UnderExposureComponent implements OnInit {
    inDanger = false;

    private logger: Logger;

    constructor(
        private contentViewModalService: ContentViewModalService,
        private dialogsService: DialogsService,
        private feedbackModalService: FeedbackModalService,
        private progressViewService: ProgressViewService
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
        this.contentViewModalService.showContent("c03");
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
        // TODO: Manage this
        this.logger.debug(`Wants to leave: ${wantsToLeave}`);
        if (wantsToLeave) {
            this.feedbackModalService
                .askFeedback(askWantsToLeaveFeedback)
                .then((feedback) => {
                    this.logger.debug(`Feedback: ${feedback}`);
                    if (feedback) {
                        this.progressViewService.setAsIdle();
                    }
                });
        }
    }
}
