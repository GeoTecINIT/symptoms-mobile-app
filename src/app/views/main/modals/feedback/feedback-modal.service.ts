import { Injectable } from "@angular/core";

import { FeedbackModule } from "./feedback.module";
import { MainViewService } from "../../main-view.service";

import { FeedbackModalComponent } from "./feedback-modal.component";

@Injectable({
    providedIn: FeedbackModule,
})
export class FeedbackModalService {
    constructor(private mainViewService: MainViewService) {}

    askFeedback() {
        this.mainViewService
            .showFullScreenAnimatedModal(FeedbackModalComponent)
            .catch((e) =>
                console.error("Could not open feedback modal service:", e)
            );
    }
}
