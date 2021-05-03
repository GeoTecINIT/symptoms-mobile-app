import { Injectable } from "@angular/core";

import { FeedbackModule } from "./feedback.module";
import { MainViewService } from "../../main-view.service";

import { FeedbackModalComponent } from "./feedback-modal.component";
import { FeedbackModalOptions } from "./options";

@Injectable({
    providedIn: FeedbackModule,
})
export class FeedbackModalService {
    constructor(private mainViewService: MainViewService) {}

    askFeedback(options: FeedbackModalOptions): Promise<string> {
        return this.mainViewService.showFullScreenAnimatedModal(
            FeedbackModalComponent,
            options
        );
    }
}
