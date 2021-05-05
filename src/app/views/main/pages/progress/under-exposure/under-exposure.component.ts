import { Component, OnInit } from "@angular/core";
import { DialogsService } from "~/app/views/common/dialogs.service";
import { FeedbackModalService } from "../../../modals/feedback";
import { ProgressViewService } from "../progress-view.service";
import { getLogger, Logger } from "~/app/core/utils/logger";
import {
    dangersOfEarlyLeave,
    infoOnProgressGone,
} from "~/app/core/dialogs/info";
import {
    confirmFeelsBetter,
    confirmWantsToLeave,
} from "~/app/core/dialogs/confirm";

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

    onProgressGoneTap() {
        this.dialogsService.showInfo(infoOnProgressGone);
    }

    onWantsToLeaveTap() {
        this.dialogsService.showInfo(dangersOfEarlyLeave);
    }

    onAskForMoodTap() {
        this.dialogsService
            .askConfirmation(confirmFeelsBetter)
            .then((feelsBetter) => {
                // TODO: Manage this
                this.logger.debug(`Feels better: ${feelsBetter}`);
                if (feelsBetter) {
                    this.inDanger = false;
                }
            });
    }

    onEndExposureTap() {
        this.dialogsService
            .askConfirmationWithPositiveAction(confirmWantsToLeave)
            .then((wantsToLeave) => {
                // TODO: Manage this
                this.logger.debug(`Wants to leave: ${wantsToLeave}`);
                if (wantsToLeave) {
                    this.feedbackModalService
                        .askFeedback({
                            title: "En otro momento entonces",
                            feedbackScreen: {
                                body: {
                                    emoji: "👋",
                                    text:
                                        "No te preocupes, lo importante es ser constante. ¡Hasta pronto!",
                                },
                                question:
                                    "¿Podrías indicar el motivo de tu salida?",
                                options: [
                                    {
                                        type: "predefined",
                                        answer: "Mi nivel de ansiedad no baja",
                                    },
                                    {
                                        type: "predefined",
                                        answer:
                                            "No consigo manejar la situación",
                                    },
                                    {
                                        type: "predefined",
                                        answer: "No dispongo de más tiempo",
                                    },
                                    {
                                        type: "free-text",
                                        hint: "Otro",
                                        helpText:
                                            "Tu terapeuta podrá leer este mensaje",
                                    },
                                ],
                            },
                        })
                        .then((feedback) => {
                            this.logger.debug(`Feedback: ${feedback}`);
                            if (feedback) {
                                this.progressViewService.setAsIdle();
                            }
                        });
                }
            });
    }
}
