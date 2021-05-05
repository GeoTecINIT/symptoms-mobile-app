import { Injectable } from "@angular/core";
import { QuestionsModule } from "./questions.module";
import { MainViewService } from "~/app/views/main/main-view.service";

import { QuestionsModalComponent } from "./questions-modal.component";
import { QuestionsModalOptions } from "~/app/core/modals/questions";
import { QuestionAnswer } from "./answers";

@Injectable({
    providedIn: QuestionsModule,
})
export class QuestionsModalService {
    constructor(private mainViewService: MainViewService) {}

    deliverQuestions(
        options: QuestionsModalOptions
    ): Promise<Array<QuestionAnswer>> {
        return this.mainViewService.showFullScreenAnimatedModal(
            QuestionsModalComponent,
            options
        );
    }
}
