import { Injectable } from "@angular/core";
import { QuestionsModule } from "./questions.module";
import { MainViewService } from "~/app/views/main/main-view.service";

import { QuestionsModalComponent } from "./questions-modal.component";

@Injectable({
    providedIn: QuestionsModule,
})
export class QuestionsModalService {
    constructor(private mainViewService: MainViewService) {}

    deliverQuestions() {
        this.mainViewService
            .showFullScreenAnimatedModal(QuestionsModalComponent)
            .catch((e) => console.error("Could not open questions modal:", e));
    }
}
