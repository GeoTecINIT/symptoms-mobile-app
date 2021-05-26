import { Injectable } from "@angular/core";
import { QuestionsModule } from "./questions.module";
import { MainViewService } from "~/app/views/main/main-view.service";

import { QuestionsModalComponent } from "./questions-modal.component";
import { QuestionsModalOptions } from "~/app/core/modals/questions";
import { QuestionAnswer } from "./answers";
import { emitQuestionnaireAnswersAcquired } from "~/app/core/framework/events";
import { processQuestionnaireAnswers } from "~/app/core/framework/answers";

@Injectable({
    providedIn: QuestionsModule,
})
export class QuestionsModalService {
    constructor(private mainViewService: MainViewService) {}

    deliverQuestions(
        questionnaireId: string,
        options: QuestionsModalOptions,
        notificationId?: number
    ): Promise<Array<QuestionAnswer>> {
        const openTime = new Date();

        return this.mainViewService
            .showFullScreenAnimatedModal(QuestionsModalComponent, options)
            .then((answers: Array<QuestionAnswer>) => {
                if (answers) {
                    emitQuestionnaireAnswersAcquired(
                        processQuestionnaireAnswers(answers, {
                            openTime,
                            questionnaireId,
                            notificationId,
                        })
                    );
                }

                return answers;
            });
    }
}
