import { Injectable } from "@angular/core";
import { NavigationService } from "~/app/views/navigation.service";

import { QuestionsModalOptions } from "~/app/core/modals/questions";
import { QuestionAnswer } from "./answers";
import { emitQuestionnaireAnswersAcquiredEvent } from "~/app/core/framework/events";
import { processQuestionnaireAnswers } from "~/app/core/framework/answers";
import { filter, firstValueFrom, Subject, map, tap } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class QuestionsModalService {
    private answeredEvents = new Subject<AnsweredEvent>();

    constructor(private navigationService: NavigationService) {}

    deliverQuestions(
        questionnaireId: string,
        options: QuestionsModalOptions,
        notificationId?: number
    ): Promise<Array<QuestionAnswer>> {
        const openTime = new Date();

        this.navigationService.navigate(
            ["/main/questions", openTime.getTime()],
            {
                transition: "fade",
                duration: 200,
                state: options,
            }
        );

        return firstValueFrom(
            this.answeredEvents.pipe(
                filter((evt) => evt.instanceId === openTime.getTime()),
                map((evt) => evt.answers),
                tap((answers) => {
                    if (answers === undefined) return;
                    emitQuestionnaireAnswersAcquiredEvent(
                        processQuestionnaireAnswers(answers, {
                            openTime,
                            questionnaireId,
                            notificationId,
                        })
                    );
                })
            )
        );
    }

    gotAnswers(instanceId: number, answers?: Array<QuestionAnswer>) {
        this.answeredEvents.next({ instanceId, answers });
    }
}

interface AnsweredEvent {
    instanceId: number;
    answers?: Array<QuestionAnswer>;
}
