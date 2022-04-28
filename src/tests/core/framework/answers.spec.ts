import { QuestionnaireAnswers } from "@awarns/core/entities/answers";
import { processQuestionnaireAnswers } from "~/app/core/framework/answers";

describe("Framework answers toolkit", () => {
    it("correctly processes a sorted set of answers as questionnaire answers", () => {
        const openTime = new Date(2021, 4, 25, 9, 20, 10, 0);
        const sortedAnswers = [
            {
                title: "Question 1?",
                answer: 7,
                answerTime: new Date(2021, 4, 25, 9, 20, 15, 217),
            },
            {
                title: "Question 2?",
                answer: 2,
                answerTime: new Date(2021, 4, 25, 9, 20, 21, 67),
            },
            {
                title: "Question 3?",
                answer: 3,
                answerTime: new Date(2021, 4, 25, 9, 20, 43, 0),
            },
        ];
        const expectedQuestionnaireAnswers = new QuestionnaireAnswers(
            "q1",
            [
                {
                    title: sortedAnswers[0].title,
                    answer: sortedAnswers[0].answer,
                    millisecondsToAnswer:
                        sortedAnswers[0].answerTime.getTime() -
                        openTime.getTime(),
                },
                {
                    title: sortedAnswers[1].title,
                    answer: sortedAnswers[1].answer,
                    millisecondsToAnswer:
                        sortedAnswers[1].answerTime.getTime() -
                        sortedAnswers[0].answerTime.getTime(),
                },
                {
                    title: sortedAnswers[2].title,
                    answer: sortedAnswers[2].answer,
                    millisecondsToAnswer:
                        sortedAnswers[2].answerTime.getTime() -
                        sortedAnswers[1].answerTime.getTime(),
                },
            ],
            0
        );
        const questionnaireAnswers = processQuestionnaireAnswers(
            sortedAnswers,
            {
                openTime,
                questionnaireId: expectedQuestionnaireAnswers.questionnaireId,
                notificationId: expectedQuestionnaireAnswers.notificationId,
                submitTime: expectedQuestionnaireAnswers.timestamp,
            }
        );

        expect(questionnaireAnswers).toEqual(expectedQuestionnaireAnswers);
    });

    it("correctly processes an unsorted set of answers as questionnaire answers", () => {
        const openTime = new Date(2021, 4, 25, 9, 20, 5, 0);
        const unsortedAnswers = [
            {
                title: "Question 1?",
                answer: 8,
                answerTime: new Date(2021, 4, 25, 9, 20, 21, 67),
            },
            {
                title: "Question 2?",
                answer: 5,
                answerTime: new Date(2021, 4, 25, 9, 20, 15, 217),
            },
            {
                title: "Question 3?",
                answer: 6,
                answerTime: new Date(2021, 4, 25, 9, 20, 43, 0),
            },
        ];
        const expectedQuestionnaireAnswers = new QuestionnaireAnswers(
            "q1",
            [
                {
                    title: unsortedAnswers[0].title,
                    answer: unsortedAnswers[0].answer,
                    millisecondsToAnswer:
                        unsortedAnswers[0].answerTime.getTime() -
                        unsortedAnswers[1].answerTime.getTime(),
                },
                {
                    title: unsortedAnswers[1].title,
                    answer: unsortedAnswers[1].answer,
                    millisecondsToAnswer:
                        unsortedAnswers[1].answerTime.getTime() -
                        openTime.getTime(),
                },
                {
                    title: unsortedAnswers[2].title,
                    answer: unsortedAnswers[2].answer,
                    millisecondsToAnswer:
                        unsortedAnswers[2].answerTime.getTime() -
                        unsortedAnswers[0].answerTime.getTime(),
                },
            ],
            0
        );
        const questionnaireAnswers = processQuestionnaireAnswers(
            unsortedAnswers,
            {
                openTime,
                questionnaireId: expectedQuestionnaireAnswers.questionnaireId,
                notificationId: expectedQuestionnaireAnswers.notificationId,
                submitTime: expectedQuestionnaireAnswers.timestamp,
            }
        );

        expect(questionnaireAnswers).toEqual(expectedQuestionnaireAnswers);
    });
});
