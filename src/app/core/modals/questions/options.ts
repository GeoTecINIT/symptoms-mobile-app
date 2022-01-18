import { CompletionScreenOptions } from "~/app/core/modals/common";

export interface QuestionsModalOptions {
    title: string;
    body: {
        emoji?: string;
        iconCode?: string;
        text: string;
    };
    questions: Array<QuestionType>;
    completionScreen?: CompletionScreenOptions;
}

export type QuestionType = RangeQuestion | FreeTextQuestion | BinaryQuestion; // Append other question types here

interface Question {
    title: string;
}

interface RangeQuestion extends Question {
    type: "range";
    from: number;
    to: number;
}

interface FreeTextQuestion extends Question {
    type: "free-text";
    hint?: string;
    helpText?: string;
}

interface BinaryQuestion extends Question {
    type: "binary";
    left: string;
    right: string;
    default?: string;
}
