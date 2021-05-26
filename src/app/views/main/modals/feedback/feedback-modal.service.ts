import { Injectable } from "@angular/core";

import { FeedbackModule } from "./feedback.module";
import { MainViewService } from "../../main-view.service";

import { FeedbackModalComponent } from "./feedback-modal.component";
import {
    FeedbackModalOptions,
    PatientFeedback,
} from "~/app/core/modals/feedback";
import { emitPatientFeedbackAcquired } from "~/app/core/framework/events";

@Injectable({
    providedIn: FeedbackModule,
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
                emitPatientFeedbackAcquired(
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
