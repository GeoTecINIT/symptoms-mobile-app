import { CompletionScreenOptions } from "~/app/core/modals/common";

export interface FeedbackModalOptions {
    title: string;
    feedbackScreen: {
        body: {
            emoji?: string;
            iconCode?: string;
            text: string;
        };
        question: string;
        options: Array<AnswerOption>;
    };
    completionScreen?: CompletionScreenOptions;
}

type AnswerOption = PredefinedAnswer | FreeTextAnswer;

interface PredefinedAnswer {
    type: "predefined";
    answer: string;
}

interface FreeTextAnswer {
    type: "free-text";
    hint: string;
    helpText?: string;
}
