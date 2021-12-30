import { Injectable } from "@angular/core";

import { MainViewService } from "../../main-view.service";

import { FeedbackModalComponent } from "./feedback-modal.component";
import {
    FeedbackModalOptions,
    PatientFeedback,
} from "~/app/core/modals/feedback";
import { emitPatientFeedbackAcquiredEvent } from "~/app/core/framework/events";

@Injectable({
    providedIn: "root",
})
export class FeedbackModalService {
    constructor(private mainViewService: MainViewService) {}

    askFeedback(
        feedbackId: string,
        options: FeedbackModalOptions,
        notificationId?: number
    ): Promise<string> {
        return this.mainViewService
            .showFullScreenAnimatedModal(FeedbackModalComponent, options)
            .then((feedback) => {
                emitPatientFeedbackAcquiredEvent(
                    new PatientFeedback(
                        feedbackId,
                        options.feedbackScreen.question,
                        feedback,
                        notificationId
                    )
                );

                return feedback;
            });
    }
}
