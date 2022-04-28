import { QuestionAnswer } from "~/app/views/main/modals/questions";
import {
    QuestionnaireAnswer,
    QuestionnaireAnswers,
} from "@awarns/core/entities/answers";

export function processQuestionnaireAnswers(
    answers: Array<QuestionAnswer>,
    metadata: QuestionnaireMetadata
): QuestionnaireAnswers {
    const sortedIndexes = getSortedAnswersIndexes(answers);
    const questionnaireAnswers: Array<QuestionnaireAnswer> = new Array<
        QuestionnaireAnswer
    >(answers.length);
    for (let position = 0; position < sortedIndexes.length; position++) {
        const sortedIndex = sortedIndexes[position];
        const prevTime =
            position === 0
                ? metadata.openTime
                : answers[sortedIndexes[position - 1]].answerTime;

        const { title, answer, answerTime } = answers[sortedIndex];
        questionnaireAnswers[sortedIndex] = {
            title,
            answer,
            millisecondsToAnswer: answerTime.getTime() - prevTime.getTime(),
        };
    }

    return new QuestionnaireAnswers(
        metadata.questionnaireId,
        questionnaireAnswers,
        metadata.notificationId,
        metadata.submitTime
    );
}

export interface QuestionnaireMetadata {
    openTime: Date;
    questionnaireId: string;
    notificationId: number;
    submitTime?: Date;
}

function getSortedAnswersIndexes(
    answers: Array<QuestionAnswer>
): Array<number> {
    const indexedAnswers = answers.map((answer, i) => ({ ...answer, i }));
    const sortedAnswers = indexedAnswers.sort(
        (a1, a2) => a1.answerTime.getTime() - a2.answerTime.getTime()
    );

    return sortedAnswers.map((answer) => answer.i);
}
